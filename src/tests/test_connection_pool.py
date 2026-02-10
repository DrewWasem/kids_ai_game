"""Tests for connection pool module."""
import os
import sys
import pytest
from unittest.mock import patch, MagicMock

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'config'))


class TestPoolStatus:
    def test_status_when_not_initialized(self):
        from api.db import pool_status
        # Always import fresh to avoid state pollution
        import api.db as db_module
        original = db_module._pool
        db_module._pool = None
        try:
            status = pool_status()
            assert status["initialized"] is False
        finally:
            db_module._pool = original


class TestPooledConnection:
    @patch('api.db.get_pooled_connection')
    @patch('api.db.return_connection')
    def test_context_manager_returns_connection(self, mock_return, mock_get):
        from api.db import pooled_connection
        mock_conn = MagicMock()
        mock_get.return_value = mock_conn

        with pooled_connection() as conn:
            assert conn is mock_conn

        mock_return.assert_called_once_with(mock_conn)

    @patch('api.db.get_pooled_connection')
    @patch('api.db.return_connection')
    def test_rollback_on_exception(self, mock_return, mock_get):
        from api.db import pooled_connection
        mock_conn = MagicMock()
        mock_get.return_value = mock_conn

        with pytest.raises(ValueError):
            with pooled_connection() as conn:
                raise ValueError("test error")

        mock_conn.rollback.assert_called_once()


class TestGetPooledConnection:
    @patch('api.db._pool', None)
    @patch('api.db.psycopg2.connect')
    def test_fallback_to_direct_connection(self, mock_connect):
        from api.db import get_pooled_connection
        mock_connect.return_value = MagicMock()
        conn = get_pooled_connection()
        assert conn is not None
        mock_connect.assert_called_once()
