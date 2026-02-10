"""
Authentication
==============
JWT token and API key authentication with bcrypt password hashing.

Features:
- JWT token creation and verification
- API key validation
- bcrypt password hashing with configurable rounds
- SECRET_KEY validation (rejects weak/default keys)
- User dataclass with scope checking
"""
import logging
from dataclasses import dataclass, field
from datetime import datetime, timedelta, timezone
from typing import List, Optional

import bcrypt
from jose import JWTError, jwt

import os
import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'config'))

from config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES, BCRYPT_ROUNDS

logger = logging.getLogger(__name__)

# Reject weak/default secrets
_WEAK_SECRETS = {'secret', 'changeme', 'password', 'your-secret-key-here', ''}


@dataclass
class User:
    """Authenticated user."""
    id: int
    email: str
    display_name: Optional[str] = None
    is_active: bool = True
    scopes: List[str] = field(default_factory=list)

    def has_scope(self, scope: str) -> bool:
        """Check if user has a specific scope."""
        return scope in self.scopes or 'admin' in self.scopes


def _validate_secret_key():
    """Validate that SECRET_KEY is set and not weak."""
    if not SECRET_KEY:
        logger.warning("MYAPP_SECRET_KEY is not set! Authentication will fail.")
        return False
    if SECRET_KEY in _WEAK_SECRETS:
        logger.warning("MYAPP_SECRET_KEY is using a weak/default value!")
        return False
    if len(SECRET_KEY) < 32:
        logger.warning("MYAPP_SECRET_KEY should be at least 32 characters")
    return True


def hash_password(password: str) -> str:
    """Hash a password using bcrypt."""
    return bcrypt.hashpw(
        password.encode('utf-8'),
        bcrypt.gensalt(rounds=BCRYPT_ROUNDS)
    ).decode('utf-8')


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its bcrypt hash."""
    try:
        return bcrypt.checkpw(
            plain_password.encode('utf-8'),
            hashed_password.encode('utf-8')
        )
    except (ValueError, TypeError):
        return False


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token."""
    if not _validate_secret_key():
        raise ValueError("SECRET_KEY is not properly configured")

    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def verify_token(token: str) -> Optional[User]:
    """Verify a JWT token and return the User if valid."""
    if not SECRET_KEY:
        return None
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        email = payload.get("email")
        if user_id is None or email is None:
            return None
        return User(
            id=int(user_id),
            email=email,
            display_name=payload.get("display_name"),
            scopes=payload.get("scopes", []),
        )
    except JWTError:
        return None


def verify_api_key(api_key: str) -> Optional[User]:
    """Verify an API key against the database."""
    if not api_key:
        return None
    try:
        from api.db import pooled_connection
        with pooled_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """SELECT k.id, k.user_id, k.scopes, u.email, u.display_name
                       FROM cfg_api_key k
                       JOIN cfg_user u ON u.id = k.user_id
                       WHERE k.key_hash = crypt(%s, k.key_hash)
                         AND k.is_active = true
                         AND u.is_active = true""",
                    (api_key,)
                )
                row = cur.fetchone()
                if row:
                    # Update last_used_at
                    cur.execute(
                        "UPDATE cfg_api_key SET last_used_at = NOW() WHERE id = %s",
                        (row[0],)
                    )
                    conn.commit()
                    return User(
                        id=row[1],
                        email=row[3],
                        display_name=row[4],
                        scopes=row[2] or [],
                    )
    except Exception as e:
        logger.error(f"API key verification failed: {e}")
    return None
