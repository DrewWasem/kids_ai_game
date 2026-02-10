"""
Auth Routes
===========
Login, register, and token management endpoints.
"""
import logging

from fastapi import APIRouter, HTTPException, Request

from api.auth import User, create_access_token, hash_password, verify_password
from api.db import pooled_connection
from api.schemas import LoginRequest, RegisterRequest, TokenResponse, UserResponse

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=TokenResponse)
def login(req: LoginRequest):
    """Authenticate user and return JWT token."""
    with pooled_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT id, email, display_name, password_hash, scopes FROM cfg_user WHERE email = %s AND is_active = true",
                (req.email,)
            )
            row = cur.fetchone()

    if not row or not verify_password(req.password, row[3]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    from config import ACCESS_TOKEN_EXPIRE_MINUTES
    token = create_access_token({
        "sub": str(row[0]),
        "email": row[1],
        "display_name": row[2],
        "scopes": row[4] or [],
    })

    return TokenResponse(
        access_token=token,
        expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )


@router.post("/register", response_model=UserResponse, status_code=201)
def register(req: RegisterRequest):
    """Register a new user."""
    with pooled_connection() as conn:
        with conn.cursor() as cur:
            # Check if email exists
            cur.execute("SELECT id FROM cfg_user WHERE email = %s", (req.email,))
            if cur.fetchone():
                raise HTTPException(status_code=409, detail="Email already registered")

            password_hash = hash_password(req.password)
            cur.execute(
                """INSERT INTO cfg_user (email, password_hash, display_name)
                   VALUES (%s, %s, %s) RETURNING id, email, display_name, is_active""",
                (req.email, password_hash, req.display_name)
            )
            row = cur.fetchone()
            conn.commit()

    return UserResponse(id=row[0], email=row[1], display_name=row[2], is_active=row[3])


@router.get("/me", response_model=UserResponse)
def get_current_user(request: Request):
    """Get the current authenticated user."""
    user = getattr(request.state, 'user', None)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return UserResponse(
        id=user.id, email=user.email,
        display_name=user.display_name, is_active=user.is_active,
    )
