"""
Items Service
=============
Business logic for items, extracted from route handlers.
Demonstrates the service extraction pattern for keeping routes thin.
"""
import json
import logging
from typing import List, Optional, Tuple

from api.db import pooled_connection

logger = logging.getLogger(__name__)


class ItemsService:
    """Business logic for item operations."""

    @staticmethod
    def list_items(user_id: int, limit: int = 50, offset: int = 0) -> Tuple[List[dict], int]:
        """List items for a user with pagination. Returns (items, total_count)."""
        with pooled_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT COUNT(*) FROM items WHERE user_id = %s", (user_id,))
                total = cur.fetchone()[0]

                cur.execute(
                    """SELECT id, user_id, title, description, status, metadata, created_at, updated_at
                       FROM items WHERE user_id = %s
                       ORDER BY created_at DESC LIMIT %s OFFSET %s""",
                    (user_id, limit, offset)
                )
                rows = cur.fetchall()

        items = [
            {
                "id": r[0], "user_id": r[1], "title": r[2], "description": r[3],
                "status": r[4], "metadata": r[5] or {}, "created_at": r[6], "updated_at": r[7]
            }
            for r in rows
        ]
        return items, total

    @staticmethod
    def create_item(user_id: int, title: str, description: str = None,
                    status: str = "active", metadata: dict = None) -> dict:
        """Create a new item."""
        with pooled_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """INSERT INTO items (user_id, title, description, status, metadata)
                       VALUES (%s, %s, %s, %s, %s::jsonb)
                       RETURNING id, user_id, title, description, status, metadata, created_at, updated_at""",
                    (user_id, title, description, status, json.dumps(metadata or {}))
                )
                row = cur.fetchone()
                conn.commit()

        return {
            "id": row[0], "user_id": row[1], "title": row[2], "description": row[3],
            "status": row[4], "metadata": row[5] or {}, "created_at": row[6], "updated_at": row[7]
        }

    @staticmethod
    def get_item(item_id: int, user_id: int) -> Optional[dict]:
        """Get an item by ID. Returns None if not found."""
        with pooled_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """SELECT id, user_id, title, description, status, metadata, created_at, updated_at
                       FROM items WHERE id = %s AND user_id = %s""",
                    (item_id, user_id)
                )
                row = cur.fetchone()

        if not row:
            return None

        return {
            "id": row[0], "user_id": row[1], "title": row[2], "description": row[3],
            "status": row[4], "metadata": row[5] or {}, "created_at": row[6], "updated_at": row[7]
        }

    @staticmethod
    def delete_item(item_id: int, user_id: int) -> bool:
        """Delete an item. Returns True if deleted."""
        with pooled_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    "DELETE FROM items WHERE id = %s AND user_id = %s RETURNING id",
                    (item_id, user_id)
                )
                row = cur.fetchone()
                conn.commit()
        return row is not None
