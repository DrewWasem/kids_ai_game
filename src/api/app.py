"""
Application Factory
==================
FastAPI application with lifespan management, middleware chain,
and global exception handling.
"""
import logging
import time
import uuid
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

import os
import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'config'))

from config import CORS_ORIGINS, AUTH_MIDDLEWARE_ENABLED
from api.db import init_pool, close_pool

logger = logging.getLogger(__name__)

_start_time = time.time()

# Route modules to load dynamically
_ROUTE_MODULES = [
    'api.routes.health',
    'api.routes.auth',
    'api.routes.items',
    'api.routes.ai',
]


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan: init pool on startup, close on shutdown.

    This replaces the deprecated @app.on_event("startup") pattern.
    """
    logger.info("Starting application...")
    try:
        init_pool()
        logger.info("Database connection pool initialized")
    except Exception as e:
        logger.error(f"Failed to initialize: {e}", exc_info=True)
        # Don't raise - allow app to start even if DB is temporarily unavailable

    yield  # Application runs here

    # Shutdown
    close_pool()
    logger.info("Application shut down")


def create_app() -> FastAPI:
    """
    Create and configure the FastAPI application.

    Returns:
        Configured FastAPI application instance
    """
    app = FastAPI(
        title="MyApp API",
        version="1.0.0",
        description="SaaS application API template",
        docs_url="/api/docs",
        redoc_url="/api/redoc",
        openapi_url="/api/openapi.json",
        lifespan=lifespan,
    )

    # =============================================
    # Middleware Chain (outermost first)
    # =============================================

    # 1. CORS
    origins = CORS_ORIGINS if isinstance(CORS_ORIGINS, list) else [o.strip() for o in CORS_ORIGINS.split(',')]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # 2. Request logging + correlation ID
    @app.middleware("http")
    async def request_logging_middleware(request: Request, call_next):
        request_id = request.headers.get('X-Request-ID', str(uuid.uuid4())[:8])
        request.state.request_id = request_id
        start = time.monotonic()

        try:
            response = await call_next(request)
        except Exception as e:
            logger.error(
                f"Unhandled error in request: {e}",
                exc_info=True,
                extra={'request_id': request_id, 'path': request.url.path}
            )
            raise

        elapsed = (time.monotonic() - start) * 1000
        logger.info(
            f"{request.method} {request.url.path} → {response.status_code} ({elapsed:.0f}ms)",
            extra={'request_id': request_id}
        )
        response.headers['X-Request-ID'] = request_id
        return response

    # 3. Auth middleware (if enabled)
    if AUTH_MIDDLEWARE_ENABLED:
        try:
            from api.auth_middleware import AuthenticationMiddleware
            app.add_middleware(AuthenticationMiddleware)
            logger.info("Authentication middleware enabled")
        except ImportError:
            logger.warning("AUTH_MIDDLEWARE_ENABLED=true but auth_middleware.py not found")

    # 4. Rate limiting
    try:
        from api.rate_limit import RateLimitMiddleware
        app.add_middleware(RateLimitMiddleware)
        logger.info("Rate limiting middleware enabled")
    except ImportError:
        logger.warning("rate_limit.py not found - rate limiting disabled")

    # =============================================
    # Global Exception Handler
    # =============================================

    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        """
        Catch-all exception handler for unhandled errors.
        Logs with correlation ID and returns generic 500 response.
        """
        error_id = str(uuid.uuid4())[:8]
        logger.error(
            f"Unhandled exception [{error_id}]: {exc}",
            exc_info=True,
            extra={'error_id': error_id, 'path': request.url.path}
        )
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error", "error_id": error_id}
        )

    # =============================================
    # Register Routes
    # =============================================

    for module_path in _ROUTE_MODULES:
        try:
            import importlib
            module = importlib.import_module(module_path)
            if hasattr(module, 'router'):
                app.include_router(module.router, prefix="/api/v1")
                logger.debug(f"Loaded route module: {module_path}")
            else:
                logger.warning(f"Route module {module_path} has no 'router' attribute")
        except Exception as e:
            logger.error(f"Failed to load route module {module_path}: {e}", exc_info=True)

    logger.info(f"Application created with {len(_ROUTE_MODULES)} route modules")
    return app


# Create the application instance
app = create_app()


def get_uptime() -> float:
    """Get application uptime in seconds."""
    return time.time() - _start_time
