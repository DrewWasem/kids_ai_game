"""
Example Worker
==============
Demonstrates the BaseWorker pattern by processing items from a queue.
Run with: python -m workers.example_worker [--once] [--health-port 8090]
"""
import argparse
import logging

import os
import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'config'))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from workers.base_worker import BaseWorker

logger = logging.getLogger(__name__)


class ExampleWorker(BaseWorker):
    """Example worker that processes pending items."""

    def __init__(self, **kwargs):
        super().__init__(worker_name="example", **kwargs)

    def process_batch(self) -> int:
        """Process a batch of pending items."""
        # TODO: Replace with your actual work queue logic
        #
        # Example pattern:
        #   from api.db import pooled_connection
        #   with pooled_connection() as conn:
        #       with conn.cursor() as cur:
        #           cur.execute("SELECT id FROM work_queue WHERE status = 'pending' LIMIT 100")
        #           rows = cur.fetchall()
        #           for row in rows:
        #               self._process_item(row[0], cur)
        #           conn.commit()
        #   return len(rows)
        #
        return 0  # No work to do

    def on_startup(self):
        logger.info("Example worker starting up - ready to process items")

    def on_shutdown(self):
        logger.info("Example worker shutting down")


def main():
    parser = argparse.ArgumentParser(description="Example background worker")
    parser.add_argument('--once', action='store_true', help='Process one batch and exit')
    parser.add_argument('--health-port', type=int, default=None, help='Health server port')
    parser.add_argument('--worker-id', type=int, default=0, help='Worker ID')
    args = parser.parse_args()

    logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(levelname)s] %(name)s: %(message)s')

    worker = ExampleWorker(worker_id=args.worker_id, health_port=args.health_port)
    worker.run(once=args.once)


if __name__ == '__main__':
    main()
