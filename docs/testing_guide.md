# Testing Guide

## Overview

The test suite uses pytest with automatic test categorization by filename pattern.

## Test Categories

Tests are automatically marked based on filename and content:

| Marker | Description | Files |
|--------|-------------|-------|
| `unit` | Mock-based tests, no external dependencies | All tests (default) |
| `db` | Tests that connect to PostgreSQL | Files with `pooled_connection` or `psycopg2` imports |
| `e2e` | End-to-end pipeline tests | Files with `e2e` or `end_to_end` in name |
| `perf` | Performance, load, stress tests | Files with `perf`, `benchmark`, `stress`, or `load` in name |
| `integration` | Integration tests | Files in `tests/integration/` directory |

## Running Tests

### All Tests

```bash
cd src
source venv/bin/activate
MYAPP_SECRET_KEY="test-secret-key-for-testing-only-32chars!" python -m pytest tests/ -v
```

### Selective Tests

```bash
# Unit tests only (fastest)
make test-unit

# Unit + DB tests (skip e2e/perf/integration)
make test-fast

# Database tests only
make test-db

# Integration tests only
make test-integration

# E2E tests only
make test-e2e

# Performance tests only
make test-perf
```

### Specific Test Files

```bash
# Run one test file
MYAPP_SECRET_KEY="test-key" python -m pytest tests/test_auth.py -v

# Run multiple test files
MYAPP_SECRET_KEY="test-key" python -m pytest tests/test_auth.py tests/test_config.py -v

# Run a single test
MYAPP_SECRET_KEY="test-key" python -m pytest tests/test_auth.py::TestJWT::test_create_and_verify_token -v
```

## Test Structure

### Unit Tests (No Database)

```python
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
```

### Database Tests

```python
"""Tests for items API endpoints."""
import os
import sys
import pytest
from unittest.mock import patch, MagicMock

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'config'))


@pytest.fixture
def mock_db_connection():
    """Mock database connection for unit tests."""
    from unittest.mock import MagicMock, patch

    mock_conn = MagicMock()
    mock_cursor = MagicMock()
    mock_conn.cursor.return_value.__enter__ = MagicMock(return_value=mock_cursor)
    mock_conn.cursor.return_value.__exit__ = MagicMock(return_value=False)

    with patch('api.db.pooled_connection') as mock_pool:
        mock_pool.return_value.__enter__ = MagicMock(return_value=mock_conn)
        mock_pool.return_value.__exit__ = MagicMock(return_value=False)
        yield mock_conn, mock_cursor


class TestItemsAPI:
    @patch('api.routes.items.pooled_connection')
    def test_list_items(self, mock_pool, client):
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_cursor.fetchall.return_value = []
        mock_pool.return_value.__enter__ = MagicMock(return_value=mock_conn)

        response = client.get("/api/v1/items")
        assert response.status_code == 200
```

## Fixtures

### Global Fixtures (conftest.py)

```python
@pytest.fixture
def mock_db_connection():
    """Mock database connection for unit tests."""
    # Returns (mock_conn, mock_cursor)
    pass
```

### Test-Specific Fixtures

```python
@pytest.fixture
def client():
    """FastAPI TestClient."""
    from api.app import create_app
    from fastapi.testclient import TestClient
    app = create_app()
    return TestClient(app)


@pytest.fixture
def auth_headers():
    """Valid JWT token headers."""
    from api.auth import create_access_token
    token = create_access_token({"sub": "1", "email": "test@example.com"})
    return {"Authorization": f"Bearer {token}"}
```

## Environment Variables

Required for tests:

```bash
MYAPP_SECRET_KEY=test-secret-key-for-testing-only-32chars!
MYAPP_DB_HOST=localhost
MYAPP_DB_NAME=myapp_test
MYAPP_DB_USER=myapp
MYAPP_DB_PASSWORD=test
MYAPP_RATE_LIMIT_REDIS_URL=redis://localhost:6379
```

Disable features during tests:

```bash
MYAPP_AUTH_MIDDLEWARE_ENABLED=false
MYAPP_RATE_LIMIT_ENABLED=false
```

## Coverage

### Run with Coverage

```bash
cd src
make test-cov

# Or manually
MYAPP_SECRET_KEY="test-key" python -m pytest tests/ --cov=api --cov=workers --cov=services --cov-report=html
```

### View Report

```bash
open htmlcov/index.html
```

## Continuous Integration

GitHub Actions runs tests on every push/PR:

```yaml
# .github/workflows/ci.yml
jobs:
  test:
    steps:
      - name: Run tests
        run: cd src && python -m pytest tests/ -v --tb=short
        env:
          MYAPP_SECRET_KEY: ci-test-secret-key-32chars-minimum!
```

## Common Patterns

### Mock Database Cursor

```python
@patch('api.routes.items.pooled_connection')
def test_list_items(mock_pool):
    mock_cursor = MagicMock()
    mock_cursor.fetchall.return_value = [(1, "Item 1"), (2, "Item 2")]
    mock_cursor.fetchone.return_value = (2,)  # COUNT

    mock_conn = MagicMock()
    mock_conn.cursor.return_value.__enter__ = MagicMock(return_value=mock_cursor)
    mock_pool.return_value.__enter__ = MagicMock(return_value=mock_conn)

    # Test code here
```

### Mock Multiple Queries

When a function makes multiple queries, use `side_effect`:

```python
mock_cursor.fetchall.side_effect = [
    [(1, "Item 1")],  # First query result
    [(2, "Item 2")]   # Second query result
]
```

### Test Exception Handling

```python
def test_database_error_handling(mock_pool):
    mock_pool.side_effect = psycopg2.OperationalError("Connection failed")

    with pytest.raises(HTTPException) as exc_info:
        # Code that should raise exception
        pass

    assert exc_info.value.status_code == 500
```

## Best Practices

1. **Isolate tests** — Each test should be independent
2. **Use fixtures** — Share setup code across tests
3. **Mock external dependencies** — Database, Redis, HTTP clients
4. **Test both success and failure** — Cover error paths
5. **Use descriptive names** — `test_create_user_with_duplicate_email_returns_409`
6. **Avoid sleeps** — Use mocks instead of waiting for async operations
7. **Clean up** — Use fixtures with teardown for resource cleanup

## Debugging Failed Tests

### Verbose Output

```bash
python -m pytest tests/test_auth.py -vv
```

### Show Print Statements

```bash
python -m pytest tests/test_auth.py -s
```

### Stop on First Failure

```bash
python -m pytest tests/ -x
```

### Run Last Failed Tests

```bash
python -m pytest --lf
```

### Full Traceback

```bash
python -m pytest tests/ --tb=long
```

## Performance Testing

Performance tests are marked with `@pytest.mark.perf`:

```python
import pytest
import time

@pytest.mark.perf
def test_list_items_performance():
    start = time.time()
    # Run operation
    duration = time.time() - start
    assert duration < 1.0  # Must complete in < 1 second
```

Run performance tests:

```bash
make test-perf
```
