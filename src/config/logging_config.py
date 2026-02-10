"""
Centralized Logging Configuration
==================================
Provides structured JSON logging with rotation, context injection, and
centralized configuration for all workers and services.

Features:
- JSON and text formatters
- ContextLogger for injecting worker_id, tenant_id, request_id
- Rotating file handlers with configurable retention
- Centralized setup via dictConfig

Usage:
    from config.logging_config import setup_logging, get_logger

    # Setup logging (call once at startup)
    setup_logging(log_format='json')

    # Get a context-aware logger
    logger = get_logger(__name__, worker_id=0)
    logger.info("Processing batch", extra={'batch_id': 'abc123', 'records': 100})

Output (JSON mode):
    {
        "timestamp": "2026-02-04T10:30:00.000Z",
        "level": "INFO",
        "logger": "myapp.workers.embedding",
        "message": "Processing batch",
        "context": {"worker_id": 0, "batch_id": "abc123", "records": 100},
        "duration_ms": 5432
    }

Environment Variables:
    MYAPP_LOG_LEVEL: Log level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
    MYAPP_LOG_FORMAT: Format type ('json' or 'text')
    MYAPP_LOG_DIR: Directory for log files
    MYAPP_STRUCTURED_LOGGING: Feature flag to enable structured logging (default: true)
"""

import json
import logging
import logging.config
import os
import sys
import time
from datetime import datetime, timezone
from logging.handlers import RotatingFileHandler
from typing import Any, Dict, Optional

# Import config safely (avoid circular imports)
try:
    from config import LOG_DIR, LOG_LEVEL, LOG_FORMAT
except ImportError:
    LOG_DIR = os.environ.get('MYAPP_LOG_DIR', './logs')
    LOG_LEVEL = os.environ.get('MYAPP_LOG_LEVEL', 'INFO')
    LOG_FORMAT = os.environ.get('MYAPP_LOG_FORMAT', 'text')

# Feature flag for gradual rollout
STRUCTURED_LOGGING_ENABLED = os.environ.get('MYAPP_STRUCTURED_LOGGING', 'true').lower() in ('true', '1', 'yes')

# Rotation settings
LOG_MAX_BYTES = 50 * 1024 * 1024  # 50MB per file
LOG_BACKUP_COUNT = 10  # Keep 10 backup files
LOG_RETENTION_DAYS = 30  # Not enforced by handler, but documented for external cleanup


class JSONFormatter(logging.Formatter):
    """
    Formats log records as JSON for structured logging.

    Output format:
    {
        "timestamp": "2026-02-04T10:30:00.000Z",
        "level": "INFO",
        "logger": "myapp.workers.embedding",
        "message": "Batch completed",
        "context": {"worker_id": 0, "batch_id": "abc123"},
        "duration_ms": 5432,
        "exception": "..." (only if exc_info present)
    }
    """

    def __init__(self, include_hostname: bool = False):
        super().__init__()
        self.include_hostname = include_hostname
        self._hostname = None
        if include_hostname:
            import socket
            self._hostname = socket.gethostname()

    def format(self, record: logging.LogRecord) -> str:
        # Build base log entry
        log_entry = {
            "timestamp": datetime.fromtimestamp(record.created, tz=timezone.utc).isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
        }

        # Add hostname if enabled (for distributed deployments)
        if self.include_hostname and self._hostname:
            log_entry["hostname"] = self._hostname

        # Extract context from extra fields
        context = {}
        standard_attrs = {
            'name', 'msg', 'args', 'created', 'filename', 'funcName',
            'levelname', 'levelno', 'lineno', 'module', 'msecs',
            'pathname', 'process', 'processName', 'relativeCreated',
            'stack_info', 'exc_info', 'exc_text', 'thread', 'threadName',
            'taskName', 'message'
        }

        for key, value in record.__dict__.items():
            if key not in standard_attrs and not key.startswith('_'):
                # Serialize non-JSON-serializable objects
                try:
                    json.dumps(value)
                    context[key] = value
                except (TypeError, ValueError):
                    context[key] = str(value)

        if context:
            log_entry["context"] = context

        # Add exception info if present
        if record.exc_info:
            log_entry["exception"] = self.formatException(record.exc_info)

        # Add stack info if present
        if record.stack_info:
            log_entry["stack_info"] = record.stack_info

        return json.dumps(log_entry, default=str)


class TextFormatter(logging.Formatter):
    """
    Traditional text formatter with context injection support.

    Output format:
    2026-02-04 10:30:00 [INFO] myapp.workers.embedding: Batch completed [batch_id=abc123]
    """

    def __init__(self, include_context: bool = True):
        super().__init__(
            fmt="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S"
        )
        self.include_context = include_context

    def format(self, record: logging.LogRecord) -> str:
        # Get base formatted message
        base_message = super().format(record)

        if not self.include_context:
            return base_message

        # Extract and append context fields
        context_parts = []
        standard_attrs = {
            'name', 'msg', 'args', 'created', 'filename', 'funcName',
            'levelname', 'levelno', 'lineno', 'module', 'msecs',
            'pathname', 'process', 'processName', 'relativeCreated',
            'stack_info', 'exc_info', 'exc_text', 'thread', 'threadName',
            'taskName', 'message', 'asctime'
        }

        for key, value in record.__dict__.items():
            if key not in standard_attrs and not key.startswith('_'):
                context_parts.append(f"{key}={value}")

        if context_parts:
            return f"{base_message} [{', '.join(context_parts)}]"

        return base_message


class ContextLoggerAdapter(logging.LoggerAdapter):
    """
    Logger adapter that injects context into all log records.

    Usage:
        logger = ContextLoggerAdapter(logging.getLogger(__name__), {'worker_id': 0})
        logger.info("Processing", extra={'batch_id': 'abc'})
        # Output includes both worker_id=0 and batch_id=abc
    """

    def process(self, msg: str, kwargs: Dict[str, Any]) -> tuple:
        # Merge extra context
        extra = kwargs.get('extra', {})
        extra.update(self.extra)
        kwargs['extra'] = extra
        return msg, kwargs


class DurationLogger:
    """
    Context manager for timing operations and logging duration.

    Usage:
        with DurationLogger(logger, "Processing batch", batch_id='abc'):
            process_batch()
        # Logs: "Processing batch completed" with duration_ms in context
    """

    def __init__(self, logger: logging.Logger, message: str, level: int = logging.INFO, **context):
        self.logger = logger
        self.message = message
        self.level = level
        self.context = context
        self.start_time = None

    def __enter__(self):
        self.start_time = time.time()
        self.logger.log(self.level, f"{self.message} started", extra=self.context)
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        duration_ms = (time.time() - self.start_time) * 1000
        context = {**self.context, 'duration_ms': round(duration_ms, 2)}

        if exc_type is not None:
            context['error'] = str(exc_val)
            self.logger.log(logging.ERROR, f"{self.message} failed", extra=context, exc_info=True)
        else:
            self.logger.log(self.level, f"{self.message} completed", extra=context)

        return False  # Don't suppress exceptions


def get_formatter(format_type: str = None) -> logging.Formatter:
    """Get the appropriate formatter based on configuration."""
    if format_type is None:
        format_type = LOG_FORMAT

    if format_type.lower() == 'json' and STRUCTURED_LOGGING_ENABLED:
        return JSONFormatter(include_hostname=True)
    else:
        return TextFormatter(include_context=True)


def ensure_log_directory(log_dir: str = None) -> str:
    """Ensure the log directory exists."""
    if log_dir is None:
        log_dir = LOG_DIR

    os.makedirs(log_dir, exist_ok=True)
    return log_dir


def setup_logging(
    log_level: str = None,
    log_format: str = None,
    log_dir: str = None,
    log_file: str = None,
    console: bool = True,
    worker_id: int = None
) -> None:
    """
    Configure logging for the application.

    Args:
        log_level: Log level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
        log_format: Format type ('json' or 'text')
        log_dir: Directory for log files
        log_file: Specific log file name (default: app.log)
        console: Whether to also log to console
        worker_id: Worker ID for prefixing log file names

    Example:
        # Basic setup
        setup_logging()

        # JSON logging to custom directory
        setup_logging(log_format='json', log_dir='/var/log/myapp')

        # Worker-specific setup
        setup_logging(log_format='json', worker_id=0)
    """
    if log_level is None:
        log_level = LOG_LEVEL
    if log_format is None:
        log_format = LOG_FORMAT
    if log_dir is None:
        log_dir = LOG_DIR
    if log_file is None:
        if worker_id is not None:
            log_file = f"worker_{worker_id}.log"
        else:
            log_file = "app.log"

    # Ensure log directory exists
    ensure_log_directory(log_dir)

    # Get formatter
    formatter = get_formatter(log_format)

    # Build handlers list
    handlers = {}

    # Rotating file handler
    log_path = os.path.join(log_dir, log_file)
    handlers['file'] = {
        'class': 'logging.handlers.RotatingFileHandler',
        'filename': log_path,
        'maxBytes': LOG_MAX_BYTES,
        'backupCount': LOG_BACKUP_COUNT,
        'formatter': 'default',
        'level': log_level,
    }

    # Console handler
    if console:
        handlers['console'] = {
            'class': 'logging.StreamHandler',
            'stream': 'ext://sys.stdout',
            'formatter': 'default',
            'level': log_level,
        }

    # Configure using dictConfig
    config = {
        'version': 1,
        'disable_existing_loggers': False,
        'formatters': {
            'default': {
                '()': lambda: formatter
            }
        },
        'handlers': handlers,
        'root': {
            'level': log_level,
            'handlers': list(handlers.keys()),
        },
        'loggers': {
            'myapp': {
                'level': log_level,
                'handlers': list(handlers.keys()),
                'propagate': False,
            },
            # Reduce verbosity of third-party libraries
            'uvicorn': {'level': 'WARNING'},
            'uvicorn.error': {'level': 'WARNING'},
            'uvicorn.access': {'level': 'WARNING'},
            'httpx': {'level': 'WARNING'},
            'httpcore': {'level': 'WARNING'},
        }
    }

    logging.config.dictConfig(config)

    # Log startup message
    logger = logging.getLogger('myapp')
    logger.info(
        "Logging configured",
        extra={
            'log_level': log_level,
            'log_format': log_format,
            'log_file': log_path,
            'structured_logging': STRUCTURED_LOGGING_ENABLED
        }
    )


def get_logger(
    name: str,
    worker_id: int = None,
    tenant_id: str = None,
    request_id: str = None,
    **extra_context
) -> logging.LoggerAdapter:
    """
    Get a context-aware logger.

    Args:
        name: Logger name (typically __name__)
        worker_id: Worker ID for background workers
        tenant_id: Tenant ID for multi-tenant contexts
        request_id: Request ID for API request tracing
        **extra_context: Additional context to inject

    Returns:
        ContextLoggerAdapter with pre-configured context

    Example:
        logger = get_logger(__name__, worker_id=0)
        logger.info("Processing batch", extra={'batch_id': 'abc123'})
    """
    # Normalize logger name to myapp namespace
    if not name.startswith('myapp'):
        name = f'myapp.{name}'

    logger = logging.getLogger(name)

    # Build context
    context = {}
    if worker_id is not None:
        context['worker_id'] = worker_id
    if tenant_id is not None:
        context['tenant_id'] = tenant_id
    if request_id is not None:
        context['request_id'] = request_id
    context.update(extra_context)

    return ContextLoggerAdapter(logger, context)


def configure_worker_logging(
    worker_name: str,
    worker_id: int = None,
    log_format: str = None
) -> logging.LoggerAdapter:
    """
    Configure logging for a worker process.

    Convenience function that sets up logging and returns a context-aware logger.

    Args:
        worker_name: Name of the worker (e.g., 'task_processor', 'email_sender')
        worker_id: Worker ID for parallel workers
        log_format: Format type ('json' or 'text')

    Returns:
        Configured logger with worker context

    Example:
        logger = configure_worker_logging('task_processor', worker_id=0, log_format='json')
        logger.info("Worker started")
    """
    # Generate log file name
    if worker_id is not None:
        log_file = f"{worker_name}_{worker_id}.log"
    else:
        log_file = f"{worker_name}.log"

    # Setup logging
    setup_logging(
        log_format=log_format,
        log_file=log_file,
        worker_id=worker_id
    )

    # Return context-aware logger
    return get_logger(f'workers.{worker_name}', worker_id=worker_id)


# Backwards compatibility: export common log levels
DEBUG = logging.DEBUG
INFO = logging.INFO
WARNING = logging.WARNING
ERROR = logging.ERROR
CRITICAL = logging.CRITICAL
