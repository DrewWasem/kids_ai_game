"""
Base Worker
===========
Abstract base class for background workers with:
- Graceful shutdown via signal handlers (SIGTERM, SIGINT)
- Health server for K8s probes
- Idle/active polling intervals
- Exponential backoff on errors
- Progress tracking hooks
"""
import abc
import logging
import signal
import sys
import time
from typing import Optional

import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'config'))

from config import WORKER_IDLE_INTERVAL, WORKER_MAX_RETRIES, BACKOFF_MIN_DELAY, BACKOFF_MAX_DELAY

logger = logging.getLogger(__name__)


class BaseWorker(abc.ABC):
    """Abstract base class for background processing workers."""

    def __init__(self, worker_name: str, worker_id: int = 0,
                 health_port: Optional[int] = None):
        self.worker_name = worker_name
        self.worker_id = worker_id
        self.health_port = health_port
        self._running = True
        self._health_server = None
        self._idle_interval = WORKER_IDLE_INTERVAL
        self._active_interval = 1
        self._error_count = 0
        self._max_retries = WORKER_MAX_RETRIES
        self._total_processed = 0

        # Register signal handlers
        signal.signal(signal.SIGTERM, self._handle_signal)
        signal.signal(signal.SIGINT, self._handle_signal)

    def _handle_signal(self, signum, frame):
        """Graceful shutdown on SIGTERM/SIGINT."""
        sig_name = signal.Signals(signum).name
        logger.info(f"[{self.worker_name}:{self.worker_id}] Received {sig_name}, shutting down gracefully...")
        self._running = False

    def start_health_server(self):
        """Start the health probe server."""
        if self.health_port:
            from utils.health_server import start_health_server, set_healthy
            self._health_server = start_health_server(self.health_port)
            set_healthy(True, worker=self.worker_name, worker_id=self.worker_id)

    @abc.abstractmethod
    def process_batch(self) -> int:
        """
        Process a batch of work. Must be implemented by subclasses.

        Returns:
            Number of items processed in this batch (0 = idle).
        """
        ...

    def on_startup(self):
        """Hook called once before the main loop starts. Override for setup."""
        pass

    def on_shutdown(self):
        """Hook called once after the main loop exits. Override for cleanup."""
        pass

    def on_error(self, error: Exception):
        """Hook called when process_batch raises an exception."""
        logger.error(f"[{self.worker_name}:{self.worker_id}] Error: {error}", exc_info=True)

    def _calculate_backoff(self) -> float:
        """Calculate backoff delay based on consecutive error count."""
        delay = BACKOFF_MIN_DELAY * (2 ** min(self._error_count, 10))
        return min(delay, BACKOFF_MAX_DELAY)

    def run(self, once: bool = False):
        """
        Main worker loop.

        Args:
            once: If True, process one batch and exit (useful for testing/cron).
        """
        logger.info(
            f"[{self.worker_name}:{self.worker_id}] Starting "
            f"({'single-shot' if once else 'continuous'} mode)"
        )

        self.start_health_server()
        self.on_startup()

        try:
            while self._running:
                try:
                    processed = self.process_batch()
                    self._total_processed += processed
                    self._error_count = 0

                    if once:
                        logger.info(
                            f"[{self.worker_name}:{self.worker_id}] "
                            f"Single-shot complete: {processed} items processed"
                        )
                        break

                    # Adaptive polling: short sleep if busy, longer if idle
                    sleep_time = self._active_interval if processed > 0 else self._idle_interval
                    time.sleep(sleep_time)

                except Exception as e:
                    self._error_count += 1
                    self.on_error(e)

                    if self._error_count >= self._max_retries:
                        logger.error(
                            f"[{self.worker_name}:{self.worker_id}] "
                            f"Max retries ({self._max_retries}) exceeded, shutting down"
                        )
                        break

                    if once:
                        break

                    backoff = self._calculate_backoff()
                    logger.warning(
                        f"[{self.worker_name}:{self.worker_id}] "
                        f"Backing off {backoff:.1f}s (error {self._error_count}/{self._max_retries})"
                    )
                    time.sleep(backoff)

        finally:
            self.on_shutdown()
            logger.info(
                f"[{self.worker_name}:{self.worker_id}] Stopped. "
                f"Total processed: {self._total_processed}"
            )

    @property
    def is_running(self) -> bool:
        return self._running

    def stop(self):
        """Request graceful shutdown."""
        self._running = False
