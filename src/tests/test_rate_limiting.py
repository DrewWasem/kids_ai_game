"""Tests for rate limiting module."""
import os
import sys
import time
import pytest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'config'))


class TestParseRateLimit:
    def test_per_minute(self):
        from api.rate_limit import parse_rate_limit
        count, window = parse_rate_limit("100/minute")
        assert count == 100
        assert window == 60

    def test_per_second(self):
        from api.rate_limit import parse_rate_limit
        count, window = parse_rate_limit("10/second")
        assert count == 10
        assert window == 1

    def test_per_hour(self):
        from api.rate_limit import parse_rate_limit
        count, window = parse_rate_limit("1000/hour")
        assert count == 1000
        assert window == 3600


class TestInMemoryRateLimiter:
    def test_allows_within_limit(self):
        from api.rate_limit import InMemoryRateLimiter
        limiter = InMemoryRateLimiter()
        limited, remaining, _ = limiter.is_rate_limited("test", 5, 60)
        assert limited is False
        assert remaining == 4

    def test_blocks_when_exceeded(self):
        from api.rate_limit import InMemoryRateLimiter
        limiter = InMemoryRateLimiter()
        for _ in range(5):
            limiter.is_rate_limited("test", 5, 60)
        limited, remaining, _ = limiter.is_rate_limited("test", 5, 60)
        assert limited is True
        assert remaining == 0

    def test_different_keys_independent(self):
        from api.rate_limit import InMemoryRateLimiter
        limiter = InMemoryRateLimiter()
        for _ in range(5):
            limiter.is_rate_limited("key1", 5, 60)
        limited, _, _ = limiter.is_rate_limited("key2", 5, 60)
        assert limited is False
