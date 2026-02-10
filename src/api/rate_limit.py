"""
Rate Limiting
=============
Redis-based sliding window rate limiter with in-memory fallback.
Features: per-endpoint limits, X-RateLimit-* headers, configurable defaults.
"""
import logging
import time
from collections import defaultdict
from typing import Optional, Tuple

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse, Response

import os
import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'config'))

from config import RATE_LIMIT_ENABLED, RATE_LIMIT_REDIS_URL, RATE_LIMIT_DEFAULT

logger = logging.getLogger(__name__)


def parse_rate_limit(rate_str: str) -> Tuple[int, int]:
    """Parse rate limit string like '100/minute' into (count, window_seconds)."""
    parts = rate_str.split('/')
    count = int(parts[0])
    unit = parts[1].lower() if len(parts) > 1 else 'minute'
    windows = {'second': 1, 'minute': 60, 'hour': 3600, 'day': 86400}
    return count, windows.get(unit, 60)


class InMemoryRateLimiter:
    """Simple in-memory rate limiter using sliding window."""

    def __init__(self):
        self._windows: dict = defaultdict(list)

    def is_rate_limited(self, key: str, max_requests: int, window_seconds: int) -> Tuple[bool, int, int]:
        """Check if a key is rate limited. Returns (is_limited, remaining, reset_seconds)."""
        now = time.time()
        window_start = now - window_seconds

        # Clean old entries
        self._windows[key] = [t for t in self._windows[key] if t > window_start]

        current_count = len(self._windows[key])
        remaining = max(0, max_requests - current_count)

        if current_count >= max_requests:
            reset_at = self._windows[key][0] + window_seconds
            return True, 0, int(reset_at - now)

        self._windows[key].append(now)
        return False, remaining - 1, window_seconds


class RedisRateLimiter:
    """Redis-based sliding window rate limiter."""

    def __init__(self, redis_url: str):
        self._redis = None
        try:
            import redis
            self._redis = redis.from_url(redis_url, decode_responses=True)
            self._redis.ping()
            logger.info("Redis rate limiter connected")
        except Exception as e:
            logger.warning(f"Redis unavailable, falling back to in-memory: {e}")
            self._redis = None
        self._fallback = InMemoryRateLimiter()

    def is_rate_limited(self, key: str, max_requests: int, window_seconds: int) -> Tuple[bool, int, int]:
        if not self._redis:
            return self._fallback.is_rate_limited(key, max_requests, window_seconds)

        try:
            now = time.time()
            pipe = self._redis.pipeline()
            pipe.zremrangebyscore(key, 0, now - window_seconds)
            pipe.zcard(key)
            pipe.zadd(key, {str(now): now})
            pipe.expire(key, window_seconds)
            results = pipe.execute()

            current_count = results[1]
            remaining = max(0, max_requests - current_count)

            if current_count >= max_requests:
                return True, 0, window_seconds
            return False, remaining, window_seconds
        except Exception as e:
            logger.warning(f"Redis error, using fallback: {e}")
            return self._fallback.is_rate_limited(key, max_requests, window_seconds)


# Singleton limiter
_limiter: Optional[object] = None


def get_limiter():
    global _limiter
    if _limiter is None:
        if RATE_LIMIT_REDIS_URL:
            _limiter = RedisRateLimiter(RATE_LIMIT_REDIS_URL)
        else:
            _limiter = InMemoryRateLimiter()
    return _limiter


# Per-endpoint rate limits (override defaults)
ENDPOINT_LIMITS = {
    '/api/v1/auth/login': '10/minute',
    '/api/v1/auth/register': '5/minute',
}


class RateLimitMiddleware(BaseHTTPMiddleware):
    """Rate limiting middleware with X-RateLimit headers."""

    async def dispatch(self, request: Request, call_next) -> Response:
        if not RATE_LIMIT_ENABLED:
            return await call_next(request)

        # Determine client key
        client_ip = request.client.host if request.client else 'unknown'
        user = getattr(request.state, 'user', None)
        key = f"rl:{getattr(user, 'id', client_ip)}:{request.url.path}"

        # Get rate limit for this endpoint
        rate_str = ENDPOINT_LIMITS.get(request.url.path, RATE_LIMIT_DEFAULT)
        max_requests, window_seconds = parse_rate_limit(rate_str)

        limiter = get_limiter()
        is_limited, remaining, reset = limiter.is_rate_limited(key, max_requests, window_seconds)

        if is_limited:
            return JSONResponse(
                status_code=429,
                content={"detail": "Rate limit exceeded", "retry_after": reset},
                headers={
                    "X-RateLimit-Limit": str(max_requests),
                    "X-RateLimit-Remaining": "0",
                    "X-RateLimit-Reset": str(reset),
                    "Retry-After": str(reset),
                }
            )

        response = await call_next(request)
        response.headers["X-RateLimit-Limit"] = str(max_requests)
        response.headers["X-RateLimit-Remaining"] = str(remaining)
        response.headers["X-RateLimit-Reset"] = str(reset)
        return response
