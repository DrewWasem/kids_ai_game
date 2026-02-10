"""Tests for auth module."""
import os
import sys
import pytest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'config'))
os.environ.setdefault('MYAPP_SECRET_KEY', 'test-secret-key-for-testing-only-32chars!')


class TestPasswordHashing:
    def test_hash_and_verify(self):
        from api.auth import hash_password, verify_password
        hashed = hash_password("mypassword")
        assert verify_password("mypassword", hashed) is True
        assert verify_password("wrongpassword", hashed) is False

    def test_hash_is_different_each_time(self):
        from api.auth import hash_password
        h1 = hash_password("same")
        h2 = hash_password("same")
        assert h1 != h2  # bcrypt uses random salt

    def test_verify_invalid_hash(self):
        from api.auth import verify_password
        assert verify_password("pass", "not-a-valid-hash") is False


class TestJWT:
    def test_create_and_verify_token(self):
        from api.auth import create_access_token, verify_token
        token = create_access_token({"sub": "1", "email": "test@example.com"})
        user = verify_token(token)
        assert user is not None
        assert user.id == 1
        assert user.email == "test@example.com"

    def test_verify_invalid_token(self):
        from api.auth import verify_token
        assert verify_token("invalid.token.here") is None

    def test_token_with_scopes(self):
        from api.auth import create_access_token, verify_token
        token = create_access_token({"sub": "1", "email": "a@b.com", "scopes": ["admin"]})
        user = verify_token(token)
        assert "admin" in user.scopes

    def test_user_has_scope(self):
        from api.auth import User
        user = User(id=1, email="a@b.com", scopes=["read", "write"])
        assert user.has_scope("read") is True
        assert user.has_scope("delete") is False

    def test_admin_has_all_scopes(self):
        from api.auth import User
        admin = User(id=1, email="a@b.com", scopes=["admin"])
        assert admin.has_scope("anything") is True
