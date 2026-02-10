"""
Exponential Backoff Utility
============================
Provides exponential backoff with jitter for resilient retry logic.
Includes CircuitBreaker pattern implementation.
"""
import functools
import logging
import random
import time
from dataclasses import dataclass
from typing import Callable, Optional, Tuple, Type

try:
    from config import BACKOFF_MIN_DELAY, BACKOFF_MAX_DELAY, BACKOFF_MULTIPLIER
except ImportError:
    BACKOFF_MIN_DELAY = 1.0
    BACKOFF_MAX_DELAY = 60.0
    BACKOFF_MULTIPLIER = 2.0

logger = logging.getLogger(__name__)


class MaxRetriesExceeded(Exception):
    """Raised when maximum retry attempts are exceeded."""
    pass


class CircuitBreakerOpen(Exception):
    """Raised when circuit breaker is open."""
    pass


class ExponentialBackoff:
    """Exponential backoff calculator with jitter."""

    def __init__(self, min_delay: float = None, max_delay: float = None,
                 multiplier: float = None, jitter: float = 0.1,
                 max_retries: Optional[int] = None):
        self.min_delay = min_delay if min_delay is not None else BACKOFF_MIN_DELAY
        self.max_delay = max_delay if max_delay is not None else BACKOFF_MAX_DELAY
        self.multiplier = multiplier if multiplier is not None else BACKOFF_MULTIPLIER
        self.jitter = jitter
        self.max_retries = max_retries
        self._attempt = 0
        self._total_delay = 0.0

    def reset(self):
        self._attempt = 0
        self._total_delay = 0.0

    @property
    def attempt(self) -> int:
        return self._attempt

    @property
    def total_delay(self) -> float:
        return self._total_delay

    def _calculate_delay(self, attempt: int) -> float:
        delay = self.min_delay * (self.multiplier ** attempt)
        delay = min(delay, self.max_delay)
        if self.jitter > 0:
            jitter_range = delay * self.jitter
            delay += random.uniform(-jitter_range, jitter_range)
        return max(0.0, delay)

    def next_delay(self) -> float:
        if self.max_retries is not None and self._attempt >= self.max_retries:
            raise MaxRetriesExceeded(f"Maximum retries ({self.max_retries}) exceeded")
        delay = self._calculate_delay(self._attempt)
        self._attempt += 1
        self._total_delay += delay
        return delay

    def peek_delay(self) -> float:
        return self._calculate_delay(self._attempt)

    def can_retry(self) -> bool:
        if self.max_retries is None:
            return True
        return self._attempt < self.max_retries

    def wait(self) -> float:
        delay = self.next_delay()
        time.sleep(delay)
        return delay


class BackoffContext:
    """Context manager for backoff-controlled retry loops."""

    def __init__(self, max_retries: int = 5, min_delay: float = None,
                 max_delay: float = None, multiplier: float = None,
                 jitter: float = 0.1, logger: logging.Logger = None):
        self.backoff = ExponentialBackoff(
            min_delay=min_delay, max_delay=max_delay,
            multiplier=multiplier, jitter=jitter, max_retries=max_retries
        )
        self.logger = logger or logging.getLogger(__name__)
        self._succeeded = False
        self._last_error: Optional[Exception] = None

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        return False

    def should_retry(self) -> bool:
        return not self._succeeded and self.backoff.can_retry()

    def record_failure(self, error: Exception, wait: bool = True):
        self._last_error = error
        if self.backoff.can_retry():
            delay = self.backoff.next_delay()
            self.logger.warning(
                f"Operation failed (attempt {self.backoff.attempt}): {error}. "
                f"Retrying in {delay:.1f}s..."
            )
            if wait:
                time.sleep(delay)
        else:
            self.logger.error(f"Operation failed after {self.backoff.attempt} attempts: {error}")

    def success(self):
        self._succeeded = True
        self.backoff.reset()

    @property
    def succeeded(self) -> bool:
        return self._succeeded

    @property
    def last_error(self) -> Optional[Exception]:
        return self._last_error


def with_backoff(max_retries: int = 5, min_delay: float = None, max_delay: float = None,
                 multiplier: float = None, jitter: float = 0.1,
                 exceptions: Tuple[Type[Exception], ...] = (Exception,),
                 on_retry: Optional[Callable] = None, logger: logging.Logger = None):
    """Decorator for automatic retry with exponential backoff."""
    def decorator(func: Callable) -> Callable:
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            _logger = logger or logging.getLogger(func.__module__)
            backoff = ExponentialBackoff(
                min_delay=min_delay, max_delay=max_delay,
                multiplier=multiplier, jitter=jitter, max_retries=max_retries
            )
            last_error = None
            while backoff.can_retry():
                try:
                    return func(*args, **kwargs)
                except exceptions as e:
                    last_error = e
                    try:
                        delay = backoff.next_delay()
                    except MaxRetriesExceeded:
                        break
                    if on_retry:
                        on_retry(e, backoff.attempt, delay)
                    _logger.warning(
                        f"{func.__name__} failed (attempt {backoff.attempt}/{max_retries}): {e}. "
                        f"Retrying in {delay:.1f}s..."
                    )
                    time.sleep(delay)
            _logger.error(f"{func.__name__} failed after {backoff.attempt} attempts")
            raise last_error
        return wrapper
    return decorator


class CircuitBreaker:
    """Circuit breaker pattern: CLOSED -> OPEN -> HALF_OPEN -> CLOSED."""
    CLOSED = 'closed'
    OPEN = 'open'
    HALF_OPEN = 'half_open'

    def __init__(self, failure_threshold: int = 5, recovery_timeout: float = 60.0,
                 half_open_max_calls: int = 3):
        self.failure_threshold = failure_threshold
        self.recovery_timeout = recovery_timeout
        self.half_open_max_calls = half_open_max_calls
        self._state = self.CLOSED
        self._failure_count = 0
        self._success_count = 0
        self._last_failure_time: Optional[float] = None
        self._half_open_calls = 0

    @property
    def state(self) -> str:
        self._update_state()
        return self._state

    def _update_state(self):
        if self._state == self.OPEN and self._last_failure_time:
            if time.time() - self._last_failure_time >= self.recovery_timeout:
                self._state = self.HALF_OPEN
                self._half_open_calls = 0

    def is_open(self) -> bool:
        self._update_state()
        return self._state == self.OPEN

    def allow_request(self) -> bool:
        self._update_state()
        if self._state == self.CLOSED:
            return True
        if self._state == self.HALF_OPEN:
            if self._half_open_calls < self.half_open_max_calls:
                self._half_open_calls += 1
                return True
            return False
        return False

    def record_success(self):
        if self._state == self.HALF_OPEN:
            self._success_count += 1
            if self._success_count >= self.half_open_max_calls:
                self._state = self.CLOSED
                self._failure_count = 0
                self._success_count = 0
        elif self._state == self.CLOSED:
            self._failure_count = 0

    def record_failure(self):
        self._failure_count += 1
        self._last_failure_time = time.time()
        if self._state == self.HALF_OPEN:
            self._state = self.OPEN
            self._success_count = 0
        elif self._state == self.CLOSED and self._failure_count >= self.failure_threshold:
            self._state = self.OPEN

    def reset(self):
        self._state = self.CLOSED
        self._failure_count = 0
        self._success_count = 0
        self._last_failure_time = None
        self._half_open_calls = 0
