"""
SDK Client
==========
Python client for the API. Supports JWT and API key authentication.

Usage:
    from sdk.client import Client

    client = Client(base_url="http://localhost:8001", api_key="your-key")
    items = client.list_items()
    item = client.create_item(title="New Item", description="...")
"""
import logging
from typing import Any, Dict, Iterator, List, Optional

import httpx

from sdk.exceptions import APIError, AuthenticationError, NotFoundError
from sdk.models import HealthStatus, Item, PaginatedResponse

logger = logging.getLogger(__name__)


class Client:
    """Synchronous API client."""

    def __init__(self, base_url: str = "http://localhost:8001",
                 api_key: str = None, token: str = None, timeout: float = 30.0):
        self.base_url = base_url.rstrip('/')
        self._api_key = api_key
        self._token = token
        self._timeout = timeout
        self._client = httpx.Client(timeout=timeout)

    def _headers(self) -> Dict[str, str]:
        headers = {"Content-Type": "application/json"}
        if self._api_key:
            headers["X-API-Key"] = self._api_key
        elif self._token:
            headers["Authorization"] = f"Bearer {self._token}"
        return headers

    def _request(self, method: str, path: str, **kwargs) -> Any:
        url = f"{self.base_url}/api/v1{path}"
        response = self._client.request(method, url, headers=self._headers(), **kwargs)

        if response.status_code == 401:
            raise AuthenticationError("Authentication failed")
        if response.status_code == 404:
            raise NotFoundError(f"Not found: {path}")
        if response.status_code >= 400:
            detail = response.json().get("detail", response.text) if response.text else str(response.status_code)
            raise APIError(f"API error {response.status_code}: {detail}", status_code=response.status_code)

        if response.status_code == 204:
            return None
        return response.json()

    def login(self, email: str, password: str) -> str:
        """Login and store the JWT token. Returns the token."""
        data = self._request("POST", "/auth/login", json={"email": email, "password": password})
        self._token = data["access_token"]
        return self._token

    # --- Health ---
    def health(self) -> HealthStatus:
        data = self._request("GET", "/health")
        return HealthStatus(**data)

    # --- Items CRUD ---
    def list_items(self, page: int = 1, limit: int = 50) -> PaginatedResponse:
        data = self._request("GET", f"/items?page={page}&limit={limit}")
        items = [Item(**i) for i in data["items"]]
        return PaginatedResponse(items=items, total=data["total"], page=data["page"], limit=data["limit"], pages=data["pages"])

    def create_item(self, title: str, description: str = None,
                    status: str = "active", metadata: dict = None) -> Item:
        data = self._request("POST", "/items", json={
            "title": title, "description": description,
            "status": status, "metadata": metadata or {},
        })
        return Item(**data)

    def get_item(self, item_id: int) -> Item:
        data = self._request("GET", f"/items/{item_id}")
        return Item(**data)

    def update_item(self, item_id: int, **kwargs) -> Item:
        data = self._request("PUT", f"/items/{item_id}", json=kwargs)
        return Item(**data)

    def delete_item(self, item_id: int) -> None:
        self._request("DELETE", f"/items/{item_id}")

    def iter_items(self, limit: int = 50) -> Iterator[Item]:
        """Auto-paging iterator over all items."""
        page = 1
        while True:
            result = self.list_items(page=page, limit=limit)
            yield from result.items
            if page >= result.pages:
                break
            page += 1

    def close(self):
        self._client.close()

    def __enter__(self):
        return self

    def __exit__(self, *args):
        self.close()
