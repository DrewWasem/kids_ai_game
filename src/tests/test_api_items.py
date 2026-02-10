"""Tests for items API endpoints."""
import os
import sys
import json
import pytest
from unittest.mock import patch, MagicMock
from datetime import datetime

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'config'))
os.environ.setdefault('MYAPP_SECRET_KEY', 'test-secret-key-for-testing-only-32chars!')
os.environ['MYAPP_AUTH_MIDDLEWARE_ENABLED'] = 'false'
os.environ['MYAPP_RATE_LIMIT_ENABLED'] = 'false'

from fastapi.testclient import TestClient
from starlette.middleware.base import BaseHTTPMiddleware


class InjectTestUserMiddleware(BaseHTTPMiddleware):
    """Inject a fake user into request.state for testing."""
    async def dispatch(self, request, call_next):
        from api.auth import User
        request.state.user = User(id=1, email="test@example.com", scopes=[])
        request.state.authenticated = True
        return await call_next(request)


@pytest.fixture
def client():
    from api.app import create_app
    app = create_app()
    app.add_middleware(InjectTestUserMiddleware)
    return TestClient(app)


@pytest.fixture
def auth_headers():
    from api.auth import create_access_token
    token = create_access_token({"sub": "1", "email": "test@example.com", "scopes": []})
    return {"Authorization": f"Bearer {token}"}


class TestHealthEndpoint:
    def test_health_returns_200(self, client):
        response = client.get("/api/v1/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"

    def test_health_includes_uptime(self, client):
        response = client.get("/api/v1/health")
        data = response.json()
        assert "uptime_seconds" in data


class TestItemsEndpoints:
    @patch('api.routes.items.pooled_connection')
    def test_list_items(self, mock_pool, client, auth_headers):
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_cursor.fetchone.return_value = (0,)
        mock_cursor.fetchall.return_value = []
        mock_conn.cursor.return_value.__enter__ = MagicMock(return_value=mock_cursor)
        mock_conn.cursor.return_value.__exit__ = MagicMock(return_value=False)
        mock_pool.return_value.__enter__ = MagicMock(return_value=mock_conn)
        mock_pool.return_value.__exit__ = MagicMock(return_value=False)

        response = client.get("/api/v1/items", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["total"] == 0
        assert data["items"] == []

    def test_create_item_requires_title(self, client, auth_headers):
        response = client.post("/api/v1/items", json={}, headers=auth_headers)
        assert response.status_code == 422  # Pydantic validation error
