"""
Items Routes (Example CRUD)
============================
Demonstrates the standard CRUD pattern with:
- Connection pooling via pooled_connection()
- Auth via request.state.user (set by middleware)
- Pydantic schema validation
- Pagination
- Service layer delegation
"""
import logging

from fastapi import APIRouter, HTTPException, Request

from api.db import pooled_connection
from api.deps import get_pagination_params
from api.schemas import ItemCreate, ItemResponse, ItemUpdate, PaginatedResponse

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/items", tags=["items"])


@router.get("", response_model=PaginatedResponse[ItemResponse])
def list_items(request: Request):
    """List items with pagination."""
    user = request.state.user
    page, limit, offset = get_pagination_params(request)

    with pooled_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT COUNT(*) FROM items WHERE user_id = %s",
                (user.id,)
            )
            total = cur.fetchone()[0]

            cur.execute(
                """SELECT id, user_id, title, description, status, metadata, created_at, updated_at
                   FROM items WHERE user_id = %s
                   ORDER BY created_at DESC LIMIT %s OFFSET %s""",
                (user.id, limit, offset)
            )
            rows = cur.fetchall()

    items = [
        ItemResponse(
            id=r[0], user_id=r[1], title=r[2], description=r[3],
            status=r[4], metadata=r[5] or {}, created_at=r[6], updated_at=r[7]
        )
        for r in rows
    ]

    return PaginatedResponse(
        items=items, total=total, page=page, limit=limit,
        pages=(total + limit - 1) // limit if limit > 0 else 0
    )


@router.post("", response_model=ItemResponse, status_code=201)
def create_item(request: Request, item: ItemCreate):
    """Create a new item."""
    user = request.state.user
    import json

    with pooled_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """INSERT INTO items (user_id, title, description, status, metadata)
                   VALUES (%s, %s, %s, %s, %s::jsonb)
                   RETURNING id, user_id, title, description, status, metadata, created_at, updated_at""",
                (user.id, item.title, item.description, item.status, json.dumps(item.metadata))
            )
            row = cur.fetchone()
            conn.commit()

    return ItemResponse(
        id=row[0], user_id=row[1], title=row[2], description=row[3],
        status=row[4], metadata=row[5] or {}, created_at=row[6], updated_at=row[7]
    )


@router.get("/{item_id}", response_model=ItemResponse)
def get_item(request: Request, item_id: int):
    """Get a single item by ID."""
    user = request.state.user

    with pooled_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """SELECT id, user_id, title, description, status, metadata, created_at, updated_at
                   FROM items WHERE id = %s AND user_id = %s""",
                (item_id, user.id)
            )
            row = cur.fetchone()

    if not row:
        raise HTTPException(status_code=404, detail="Item not found")

    return ItemResponse(
        id=row[0], user_id=row[1], title=row[2], description=row[3],
        status=row[4], metadata=row[5] or {}, created_at=row[6], updated_at=row[7]
    )


@router.put("/{item_id}", response_model=ItemResponse)
def update_item(request: Request, item_id: int, item: ItemUpdate):
    """Update an item."""
    user = request.state.user
    import json

    # Build dynamic update
    fields = []
    values = []
    if item.title is not None:
        fields.append("title = %s")
        values.append(item.title)
    if item.description is not None:
        fields.append("description = %s")
        values.append(item.description)
    if item.status is not None:
        fields.append("status = %s")
        values.append(item.status)
    if item.metadata is not None:
        fields.append("metadata = %s::jsonb")
        values.append(json.dumps(item.metadata))

    if not fields:
        raise HTTPException(status_code=400, detail="No fields to update")

    values.extend([item_id, user.id])

    with pooled_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                f"""UPDATE items SET {', '.join(fields)}
                    WHERE id = %s AND user_id = %s
                    RETURNING id, user_id, title, description, status, metadata, created_at, updated_at""",
                values
            )
            row = cur.fetchone()
            conn.commit()

    if not row:
        raise HTTPException(status_code=404, detail="Item not found")

    return ItemResponse(
        id=row[0], user_id=row[1], title=row[2], description=row[3],
        status=row[4], metadata=row[5] or {}, created_at=row[6], updated_at=row[7]
    )


@router.delete("/{item_id}", status_code=204)
def delete_item(request: Request, item_id: int):
    """Delete an item."""
    user = request.state.user

    with pooled_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "DELETE FROM items WHERE id = %s AND user_id = %s RETURNING id",
                (item_id, user.id)
            )
            row = cur.fetchone()
            conn.commit()

    if not row:
        raise HTTPException(status_code=404, detail="Item not found")
