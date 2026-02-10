"""Tests for config module."""
import os
import pytest
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'config'))


class TestGetEnv:
    def test_default_value(self):
        from config import _get_env
        assert _get_env('NONEXISTENT_VAR_12345', 'default') == 'default'

    def test_string_value(self, monkeypatch):
        from config import _get_env
        monkeypatch.setenv('TEST_VAR', 'hello')
        assert _get_env('TEST_VAR', 'default') == 'hello'

    def test_int_cast(self, monkeypatch):
        from config import _get_env
        monkeypatch.setenv('TEST_INT', '42')
        assert _get_env('TEST_INT', 0, int) == 42

    def test_float_cast(self, monkeypatch):
        from config import _get_env
        monkeypatch.setenv('TEST_FLOAT', '3.14')
        assert _get_env('TEST_FLOAT', 0.0, float) == 3.14

    def test_bool_true(self, monkeypatch):
        from config import _get_env
        for val in ('true', '1', 'yes', 'on'):
            monkeypatch.setenv('TEST_BOOL', val)
            assert _get_env('TEST_BOOL', False, bool) is True

    def test_bool_false(self, monkeypatch):
        from config import _get_env
        monkeypatch.setenv('TEST_BOOL', 'false')
        assert _get_env('TEST_BOOL', True, bool) is False

    def test_list_cast(self, monkeypatch):
        from config import _get_env
        monkeypatch.setenv('TEST_LIST', 'a, b, c')
        assert _get_env('TEST_LIST', [], list) == ['a', 'b', 'c']

    def test_list_empty(self, monkeypatch):
        from config import _get_env
        monkeypatch.setenv('TEST_LIST', '')
        assert _get_env('TEST_LIST', ['default'], list) == []


class TestConfigDefaults:
    def test_db_defaults(self):
        from config import DB_HOST, DB_PORT, DB_NAME
        assert DB_HOST is not None
        assert DB_PORT is not None
        assert DB_NAME is not None

    def test_pagination_defaults(self):
        from config import API_DEFAULT_PAGE_SIZE, API_MAX_PAGE_SIZE
        assert API_DEFAULT_PAGE_SIZE > 0
        assert API_MAX_PAGE_SIZE >= API_DEFAULT_PAGE_SIZE
