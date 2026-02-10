"""
Database Connection Pool
========================
Provides connection pooling using psycopg2.pool.ThreadedConnectionPool.
Includes slow query logging and retry with exponential backoff.
"""
import logging
import time
from contextlib import contextmanager

import psycopg2
import psycopg2.extensions
from psycopg2 import pool

import os
import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'config'))

from config import (
    DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD,
    DB_POOL_MIN, DB_POOL_MAX, DB_CONNECT_TIMEOUT, SLOW_QUERY_THRESHOLD_MS,
)

logger = logging.getLogger(__name__)

_pool = None


def init_pool() -> None:
    """Initialize the connection pool. Call once at application startup."""
    global _pool
    try:
        _pool = pool.ThreadedConnectionPool(
            minconn=DB_POOL_MIN,
            maxconn=DB_POOL_MAX,
            host=DB_HOST,
            port=DB_PORT,
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD,
            connect_timeout=DB_CONNECT_TIMEOUT,
        )
        logger.info(
            f"Connection pool initialized: min={DB_POOL_MIN}, max={DB_POOL_MAX}, "
            f"host={DB_HOST}:{DB_PORT}/{DB_NAME}"
        )
    except psycopg2.Error as e:
        logger.error(f"Failed to initialize connection pool: {e}")
        _pool = None
        raise


def close_pool() -> None:
    """Close all connections in the pool."""
    global _pool
    if _pool:
        _pool.closeall()
        logger.info("Connection pool closed")
        _pool = None


def get_pooled_connection(max_retries: int = 3) -> psycopg2.extensions.connection:
    """
    Get a connection from the pool with retry on transient errors.

    Args:
        max_retries: Maximum number of retry attempts

    Returns:
        Database connection from pool or direct connection if pool not initialized

    Raises:
        psycopg2.OperationalError: If connection fails after max_retries
    """
    for attempt in range(max_retries + 1):
        try:
            if _pool:
                return _pool.getconn()
            logger.debug("Pool not initialized, using direct connection")
            return psycopg2.connect(
                host=DB_HOST,
                port=DB_PORT,
                dbname=DB_NAME,
                user=DB_USER,
                password=DB_PASSWORD,
                connect_timeout=DB_CONNECT_TIMEOUT,
            )
        except psycopg2.OperationalError as e:
            if attempt < max_retries:
                delay = min(0.5 * (2 ** attempt), 5.0)
                logger.warning(
                    f"DB connection failed (attempt {attempt + 1}/{max_retries + 1}): {e}, "
                    f"retrying in {delay:.1f}s"
                )
                time.sleep(delay)
            else:
                logger.error(f"DB connection failed after {max_retries + 1} attempts: {e}")
                raise


def return_connection(conn: psycopg2.extensions.connection) -> None:
    """
    Return a connection to the pool.

    Args:
        conn: Database connection to return
    """
    if _pool and conn:
        try:
            _pool.putconn(conn)
        except Exception:
            # If pool return fails, close the connection
            try:
                conn.close()
            except Exception:
                pass
    elif conn:
        # No pool, just close the connection
        try:
            conn.close()
        except Exception:
            pass


@contextmanager
def pooled_connection(log_slow_queries: bool = True):
    """
    Context manager for pooled database connections with slow query logging.

    Args:
        log_slow_queries: Whether to log slow queries (default: True)

    Yields:
        Database connection

    Example:
        with pooled_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT * FROM items")
                rows = cur.fetchall()
    """
    conn = get_pooled_connection()
    start = time.monotonic()
    try:
        yield conn
    except Exception:
        conn.rollback()
        raise
    finally:
        elapsed_ms = (time.monotonic() - start) * 1000
        if log_slow_queries and elapsed_ms > SLOW_QUERY_THRESHOLD_MS:
            logger.warning(
                f"Slow DB operation: {elapsed_ms:.0f}ms (threshold={SLOW_QUERY_THRESHOLD_MS}ms)"
            )
        return_connection(conn)


def pool_status() -> dict:
    """
    Return pool status for monitoring.

    Returns:
        Dictionary with pool status information
    """
    if not _pool:
        return {"initialized": False}
    return {
        "initialized": True,
        "min_connections": DB_POOL_MIN,
        "max_connections": DB_POOL_MAX,
    }
