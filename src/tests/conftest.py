"""
Test Configuration
==================
Auto-marks tests by filename pattern for selective test execution.
Markers: unit, db, e2e, perf, integration
"""
import os
import pytest


def pytest_collection_modifyitems(config, items):
    """Auto-mark tests based on file path patterns."""
    for item in items:
        filepath = str(item.fspath)

        # Mark integration tests
        if '/integration/' in filepath:
            item.add_marker(pytest.mark.integration)
        # Mark e2e tests
        elif 'e2e' in filepath or 'end_to_end' in filepath:
            item.add_marker(pytest.mark.e2e)
        # Mark performance tests
        elif 'perf' in filepath or 'benchmark' in filepath or 'stress' in filepath or 'load' in filepath:
            item.add_marker(pytest.mark.perf)
        # Mark DB tests (files that import pooled_connection or psycopg2)
        elif _file_uses_db(filepath):
            item.add_marker(pytest.mark.db)
        else:
            item.add_marker(pytest.mark.unit)


def _file_uses_db(filepath: str) -> bool:
    """Check if a test file uses database connections."""
    try:
        with open(filepath, 'r') as f:
            content = f.read()
        return 'pooled_connection' in content or 'psycopg2' in content or 'get_pooled_connection' in content
    except (IOError, OSError):
        return False


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
