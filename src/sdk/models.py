"""
SDK Models
==========
Response models for the SDK client.
"""
from dataclasses import dataclass, field
from datetime import datetime
from typing import Any, Dict, List, Optional


@dataclass
class HealthStatus:
    status: str
    uptime_seconds: int = 0
    connection_pool: Dict[str, Any] = field(default_factory=dict)


@dataclass
class Item:
    id: int = 0
    user_id: int = 0
    title: str = ""
    description: Optional[str] = None
    status: str = "active"
    metadata: Dict[str, Any] = field(default_factory=dict)
    created_at: Optional[str] = None
    updated_at: Optional[str] = None


@dataclass
class PaginatedResponse:
    items: List[Any] = field(default_factory=list)
    total: int = 0
    page: int = 1
    limit: int = 50
    pages: int = 0
