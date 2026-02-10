"""
API Dependencies
================
Shared dependencies and helpers for route handlers.
"""
import logging
import uuid

from fastapi import Request
from fastapi.responses import JSONResponse

from api.db import pooled_connection

logger = logging.getLogger(__name__)


def internal_server_error(error_id: str = None) -> JSONResponse:
    """
    Return a generic 500 error response with correlation ID.

    Args:
        error_id: Optional error correlation ID (auto-generated if not provided)

    Returns:
        JSONResponse with 500 status and error details
    """
    if error_id is None:
        error_id = str(uuid.uuid4())[:8]
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error",
            "error_id": error_id,
        }
    )


def get_pagination_params(request: Request, default_limit: int = 50, max_limit: int = 500):
    """
    Extract pagination parameters from query string.

    Args:
        request: FastAPI request object
        default_limit: Default page size if not specified
        max_limit: Maximum allowed page size

    Returns:
        Tuple of (page, limit, offset) integers
    """
    try:
        page = max(1, int(request.query_params.get('page', 1)))
        limit = min(max_limit, max(1, int(request.query_params.get('limit', default_limit))))
    except (ValueError, TypeError):
        page = 1
        limit = default_limit
    offset = (page - 1) * limit
    return page, limit, offset


def validate_sort_params(request: Request, allowed_fields: list, default_field: str = 'created_at'):
    """
    Extract and validate sorting parameters from query string.

    Args:
        request: FastAPI request object
        allowed_fields: List of field names allowed for sorting
        default_field: Default field to sort by

    Returns:
        Tuple of (sort_field, sort_order) where order is 'ASC' or 'DESC'
    """
    sort_field = request.query_params.get('sort_by', default_field)
    sort_order = request.query_params.get('sort_order', 'desc').upper()

    # Validate field
    if sort_field not in allowed_fields:
        sort_field = default_field

    # Validate order
    if sort_order not in ('ASC', 'DESC'):
        sort_order = 'DESC'

    return sort_field, sort_order


def build_filter_clause(filters: dict, allowed_fields: dict) -> tuple:
    """
    Build SQL WHERE clause from filter dictionary.

    Args:
        filters: Dictionary of field->value filters
        allowed_fields: Dictionary mapping filter names to SQL column names

    Returns:
        Tuple of (where_clause, params) for safe SQL execution
    """
    clauses = []
    params = []

    for key, value in filters.items():
        if key in allowed_fields and value is not None:
            column = allowed_fields[key]
            clauses.append(f"{column} = %s")
            params.append(value)

    where_clause = " AND ".join(clauses) if clauses else "1=1"
    return where_clause, params
