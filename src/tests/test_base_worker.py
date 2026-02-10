"""Tests for base worker module."""
import os
import sys
import signal
import pytest
from unittest.mock import patch, MagicMock

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'config'))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))


class ConcreteWorker:
    """Test worker implementation."""
    def __init__(self):
        from workers.base_worker import BaseWorker
        class _Worker(BaseWorker):
            def __init__(self, **kwargs):
                super().__init__(**kwargs)
                self.batch_count = 0
                self.items_per_batch = 0

            def process_batch(self):
                self.batch_count += 1
                return self.items_per_batch

        self.cls = _Worker


class TestBaseWorker:
    def test_single_shot_mode(self):
        worker_cls = ConcreteWorker().cls
        worker = worker_cls(worker_name="test", worker_id=0)
        worker.items_per_batch = 5
        worker.run(once=True)
        assert worker.batch_count == 1
        assert worker._total_processed == 5

    def test_signal_stops_worker(self):
        worker_cls = ConcreteWorker().cls
        worker = worker_cls(worker_name="test", worker_id=0)
        assert worker.is_running is True
        worker.stop()
        assert worker.is_running is False

    def test_error_increments_count(self):
        from workers.base_worker import BaseWorker

        class ErrorWorker(BaseWorker):
            def process_batch(self):
                raise RuntimeError("test error")

        worker = ErrorWorker(worker_name="error_test", worker_id=0)
        worker._max_retries = 2
        worker.run(once=True)
        assert worker._error_count >= 1
