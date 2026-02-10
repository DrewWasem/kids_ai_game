"""
Authentication Middleware
========================
Default-deny authentication middleware.
Requires valid JWT or API key for all requests except public paths.
"""
import logging
from typing import Optional, Set

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse, Response

logger = logging.getLogger(__name__)

PUBLIC_PATHS: Set[str] = {
    '/api/v1/health',
    '/health',
    '/ready',
    '/live',
    '/metrics',
    '/api/v1/auth/login',
    '/api/v1/auth/token',
    '/api/v1/auth/register',
    '/api/v1/auth/refresh',
    '/api/docs',
    '/api/redoc',
    '/api/openapi.json',
    '/docs',
    '/redoc',
    '/openapi.json',
}

PUBLIC_PATH_PREFIXES: Set[str] = {
    '/static/',
    '/assets/',
}


def is_public_path(path: str) -> bool:
    """Check if a path is whitelisted for public access."""
    if path in PUBLIC_PATHS:
        return True
    for prefix in PUBLIC_PATH_PREFIXES:
        if path.startswith(prefix):
            return True
    return False


class AuthenticationMiddleware(BaseHTTPMiddleware):
    """Default-deny authentication middleware."""

    def __init__(self, app):
        super().__init__(app)

    async def dispatch(self, request: Request, call_next) -> Response:
        path = request.url.path

        if is_public_path(path):
            return await call_next(request)

        auth_header = request.headers.get('Authorization', '')
        api_key = request.headers.get('X-API-Key', '')

        if not auth_header and not api_key:
            logger.warning(
                f"Auth required: {request.method} {path} "
                f"from {request.client.host if request.client else 'unknown'}"
            )
            return JSONResponse(
                status_code=401,
                content={"detail": "Authentication required", "type": "authentication_required"},
                headers={"WWW-Authenticate": "Bearer"}
            )

        user = None

        if api_key:
            from api.auth import verify_api_key
            user = verify_api_key(api_key)
            if not user:
                return JSONResponse(
                    status_code=401,
                    content={"detail": "Invalid API key", "type": "invalid_api_key"},
                    headers={"WWW-Authenticate": "Bearer"}
                )

        if not user and auth_header:
            token = auth_header[7:].strip() if auth_header.startswith('Bearer ') else auth_header.strip()
            if token:
                from api.auth import verify_token
                user = verify_token(token)
            if not user:
                return JSONResponse(
                    status_code=401,
                    content={"detail": "Invalid token", "type": "invalid_token"},
                    headers={"WWW-Authenticate": "Bearer"}
                )

        if user:
            request.state.user = user
            request.state.authenticated = True

        return await call_next(request)


def get_authenticated_user(request: Request) -> Optional[dict]:
    """Get the authenticated user from request state."""
    return getattr(request.state, 'user', None)
