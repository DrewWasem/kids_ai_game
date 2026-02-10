"""
Health Routes
=============
Health check, readiness probe, and Prometheus metrics.
"""
import logging
import time

from fastapi import APIRouter
from fastapi.responses import PlainTextResponse

from api.db import pool_status

logger = logging.getLogger(__name__)

router = APIRouter(tags=["health"])

_start_time = time.time()
_health_cache = {"data": None, "expires": 0}
_CACHE_TTL = 30


@router.get("/health")
def health_check():
    """Health check endpoint with pool status and uptime."""
    now = time.time()
    if _health_cache["data"] and now < _health_cache["expires"]:
        return _health_cache["data"]

    result = {
        "status": "healthy",
        "uptime_seconds": int(now - _start_time),
        "connection_pool": pool_status(),
    }
    _health_cache["data"] = result
    _health_cache["expires"] = now + _CACHE_TTL
    return result


@router.get("/metrics/prometheus", response_class=PlainTextResponse)
def prometheus_metrics():
    """Prometheus-compatible metrics endpoint."""
    pool = pool_status()
    uptime = int(time.time() - _start_time)
    lines = [
        f'# HELP app_uptime_seconds Application uptime in seconds',
        f'# TYPE app_uptime_seconds gauge',
        f'app_uptime_seconds {uptime}',
        f'# HELP app_pool_initialized Whether connection pool is initialized',
        f'# TYPE app_pool_initialized gauge',
        f'app_pool_initialized {1 if pool.get("initialized") else 0}',
    ]
    return "\n".join(lines) + "\n"
