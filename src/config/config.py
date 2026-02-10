"""
Application Configuration
=========================
All configuration values can be overridden via environment variables.
See .env.example for the complete list of available settings.
"""

import os


def _get_env(key: str, default, cast_type=str):
    """Get environment variable with type casting."""
    value = os.environ.get(key)
    if value is None:
        return default
    if cast_type == bool:
        return value.lower() in ('true', '1', 'yes', 'on')
    if cast_type == list:
        return [v.strip() for v in value.split(',') if v.strip()]
    return cast_type(value)


# --- Database Configuration ---
DB_HOST = _get_env('MYAPP_DB_HOST', 'localhost')
DB_PORT = _get_env('MYAPP_DB_PORT', '5432')
DB_NAME = _get_env('MYAPP_DB_NAME', 'myapp')
DB_USER = _get_env('MYAPP_DB_USER', 'myapp')
DB_PASSWORD = _get_env('MYAPP_DB_PASSWORD', '')

# Connection pooling
DB_POOL_MIN = _get_env('MYAPP_DB_POOL_MIN', 1, int)
DB_POOL_MAX = _get_env('MYAPP_DB_POOL_MAX', 20, int)
DB_CONNECT_TIMEOUT = _get_env('MYAPP_DB_CONNECT_TIMEOUT', 10, int)

# Slow query threshold
SLOW_QUERY_THRESHOLD_MS = _get_env('MYAPP_SLOW_QUERY_THRESHOLD_MS', 500, int)

# --- Security Configuration ---
SECRET_KEY = _get_env('MYAPP_SECRET_KEY', None)  # Required for JWT; set via environment
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = _get_env('MYAPP_ACCESS_TOKEN_EXPIRE_MINUTES', 60, int)
BCRYPT_ROUNDS = _get_env('MYAPP_BCRYPT_ROUNDS', 12, int)

# --- AI/Claude API Configuration ---
ANTHROPIC_API_KEY = _get_env('MYAPP_ANTHROPIC_API_KEY', None)  # Required for Claude API
ANTHROPIC_MODEL = _get_env('MYAPP_ANTHROPIC_MODEL', 'claude-sonnet-4-5-20250929')  # Default to Sonnet 4.5
ANTHROPIC_MAX_TOKENS = _get_env('MYAPP_ANTHROPIC_MAX_TOKENS', 4096, int)

# --- Service URLs ---
API_URL = _get_env('MYAPP_API_URL', 'http://localhost:8001')
FRONTEND_URL = _get_env('MYAPP_FRONTEND_URL', 'http://localhost:5173')

# CORS Origins (comma-separated list)
CORS_ORIGINS = _get_env('MYAPP_CORS_ORIGINS', 'http://localhost:5173,http://localhost:8000,http://127.0.0.1:5173', list)

# --- Logging Configuration ---
LOG_DIR = _get_env('MYAPP_LOG_DIR', './logs')
LOG_LEVEL = _get_env('MYAPP_LOG_LEVEL', 'INFO')
LOG_FORMAT = _get_env('MYAPP_LOG_FORMAT', 'text')  # 'text' or 'json'

# --- Rate Limiting Configuration ---
RATE_LIMIT_ENABLED = _get_env('MYAPP_RATE_LIMIT_ENABLED', True, bool)
RATE_LIMIT_REDIS_URL = _get_env('MYAPP_RATE_LIMIT_REDIS_URL', '')
RATE_LIMIT_DEFAULT = _get_env('MYAPP_RATE_LIMIT_DEFAULT', '100/minute')

# --- API Pagination Defaults ---
API_DEFAULT_PAGE_SIZE = _get_env('MYAPP_API_DEFAULT_PAGE_SIZE', 50, int)
API_MAX_PAGE_SIZE = _get_env('MYAPP_API_MAX_PAGE_SIZE', 500, int)

# --- Worker Configuration ---
WORKER_IDLE_INTERVAL = _get_env('MYAPP_WORKER_IDLE_INTERVAL', 30, int)
WORKER_MAX_RETRIES = _get_env('MYAPP_WORKER_MAX_RETRIES', 5, int)
WORKER_HEARTBEAT_MAX_AGE = _get_env('MYAPP_WORKER_HEARTBEAT_MAX_AGE', 300, int)

# --- Backoff Configuration ---
BACKOFF_MIN_DELAY = _get_env('MYAPP_BACKOFF_MIN_DELAY', 1.0, float)
BACKOFF_MAX_DELAY = _get_env('MYAPP_BACKOFF_MAX_DELAY', 60.0, float)
BACKOFF_MULTIPLIER = _get_env('MYAPP_BACKOFF_MULTIPLIER', 2.0, float)

# --- Notification Configuration ---
# Webhook (Slack/Discord)
NOTIFICATION_WEBHOOK_URL = _get_env('MYAPP_NOTIFICATION_WEBHOOK_URL', None)
NOTIFICATION_WEBHOOK_TYPE = _get_env('MYAPP_NOTIFICATION_WEBHOOK_TYPE', 'slack')

# Email (SMTP)
NOTIFICATION_SMTP_HOST = _get_env('MYAPP_NOTIFICATION_SMTP_HOST', None)
NOTIFICATION_SMTP_PORT = _get_env('MYAPP_NOTIFICATION_SMTP_PORT', 587, int)
NOTIFICATION_SMTP_USER = _get_env('MYAPP_NOTIFICATION_SMTP_USER', None)
NOTIFICATION_SMTP_PASSWORD = _get_env('MYAPP_NOTIFICATION_SMTP_PASSWORD', None)
NOTIFICATION_EMAIL_FROM = _get_env('MYAPP_NOTIFICATION_EMAIL_FROM', None)
NOTIFICATION_EMAIL_TO = _get_env('MYAPP_NOTIFICATION_EMAIL_TO', [], list)

# Notification thresholds
NOTIFICATION_BATCH_THRESHOLD = _get_env('MYAPP_NOTIFICATION_BATCH_THRESHOLD', 10, int)
NOTIFICATION_ESCALATION_DAYS = _get_env('MYAPP_NOTIFICATION_ESCALATION_DAYS', 7, int)

# --- Auth Middleware ---
AUTH_MIDDLEWARE_ENABLED = _get_env('MYAPP_AUTH_MIDDLEWARE_ENABLED', True, bool)

# --- Health Monitoring ---
HEALTH_CHECK_INTERVAL = _get_env('MYAPP_HEALTH_CHECK_INTERVAL', 60, int)
HEALTH_ALERT_COOLDOWN = _get_env('MYAPP_HEALTH_ALERT_COOLDOWN', 300, int)
