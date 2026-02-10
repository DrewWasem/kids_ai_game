"""
API Schemas
===========
Pydantic models for request validation and response serialization.
"""
from datetime import datetime
from typing import Any, Generic, List, Optional, TypeVar

from pydantic import BaseModel, EmailStr, Field

T = TypeVar('T')


# =============================================
# Authentication & Authorization
# =============================================

class LoginRequest(BaseModel):
    """User login credentials."""
    email: str
    password: str


class RegisterRequest(BaseModel):
    """New user registration."""
    email: str
    password: str = Field(min_length=8, description="Password must be at least 8 characters")
    display_name: Optional[str] = None


class TokenResponse(BaseModel):
    """JWT token response."""
    access_token: str
    token_type: str = "bearer"
    expires_in: int


class UserResponse(BaseModel):
    """User account details."""
    model_config = {"from_attributes": True}

    id: int
    email: str
    display_name: Optional[str]
    is_active: bool
    scopes: List[str] = []
    created_at: datetime


class UpdateUserRequest(BaseModel):
    """Update user profile."""
    display_name: Optional[str] = None
    scopes: Optional[List[str]] = None


# =============================================
# API Keys
# =============================================

class CreateAPIKeyRequest(BaseModel):
    """Create a new API key."""
    name: str = Field(min_length=1, max_length=255, description="User-friendly name for the key")
    scopes: List[str] = Field(default_factory=list, description="Permission scopes")


class APIKeyResponse(BaseModel):
    """API key details (without the actual key)."""
    model_config = {"from_attributes": True}

    id: int
    user_id: int
    name: str
    scopes: List[str]
    is_active: bool
    created_at: datetime
    last_used_at: Optional[datetime]


class CreatedAPIKeyResponse(APIKeyResponse):
    """Response when creating a new API key (includes the plaintext key ONCE)."""
    api_key: str


# =============================================
# Items (Example CRUD Resource)
# =============================================

class ItemCreate(BaseModel):
    """Create a new item."""
    title: str = Field(min_length=1, max_length=255)
    description: Optional[str] = None
    status: str = "active"
    metadata: dict = Field(default_factory=dict)


class ItemUpdate(BaseModel):
    """Update an existing item."""
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    status: Optional[str] = None
    metadata: Optional[dict] = None


class ItemResponse(BaseModel):
    """Item details."""
    model_config = {"from_attributes": True}

    id: int
    user_id: int
    title: str
    description: Optional[str]
    status: str
    metadata: dict
    created_at: datetime
    updated_at: datetime


# =============================================
# Generic Responses
# =============================================

class PaginatedResponse(BaseModel, Generic[T]):
    """Generic paginated response wrapper."""
    items: List[T]
    total: int
    page: int
    limit: int
    pages: int


class ErrorResponse(BaseModel):
    """Standard error response."""
    detail: str
    error_id: Optional[str] = None
    type: Optional[str] = None
    field: Optional[str] = None


class SuccessResponse(BaseModel):
    """Generic success response."""
    success: bool = True
    message: Optional[str] = None
    data: Optional[Any] = None


class HealthResponse(BaseModel):
    """Health check response."""
    status: str
    timestamp: datetime
    version: str
    database: dict
    uptime_seconds: float
