-- Migration: V001__initial.sql
-- Date: 2026-02-09
-- Description: Initial database schema with user management and items

BEGIN;

-- =============================================
-- Extensions
-- =============================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =============================================
-- Tables
-- =============================================

-- User accounts table
CREATE TABLE IF NOT EXISTS cfg_user (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    display_name TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    scopes TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE cfg_user IS 'User accounts with authentication credentials';
COMMENT ON COLUMN cfg_user.email IS 'User email address (unique identifier)';
COMMENT ON COLUMN cfg_user.password_hash IS 'bcrypt hash of user password';
COMMENT ON COLUMN cfg_user.scopes IS 'Array of permission scopes (e.g., ["read", "write", "admin"])';
COMMENT ON COLUMN cfg_user.is_active IS 'Whether the user account is active';

-- API key management table
CREATE TABLE IF NOT EXISTS cfg_api_key (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES cfg_user(id) ON DELETE CASCADE,
    key_hash TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    scopes TEXT[] NOT NULL DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_used_at TIMESTAMP
);

COMMENT ON TABLE cfg_api_key IS 'API keys for programmatic access';
COMMENT ON COLUMN cfg_api_key.key_hash IS 'SHA-256 hash of the API key';
COMMENT ON COLUMN cfg_api_key.name IS 'User-friendly name for the key';
COMMENT ON COLUMN cfg_api_key.scopes IS 'Permission scopes for this key';
COMMENT ON COLUMN cfg_api_key.last_used_at IS 'Last time this key was used for authentication';

-- Items table (example CRUD resource)
CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES cfg_user(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    metadata JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE items IS 'Example CRUD resource - replace with your domain entities';
COMMENT ON COLUMN items.user_id IS 'Owner of this item';
COMMENT ON COLUMN items.status IS 'Item status (e.g., "active", "archived", "deleted")';
COMMENT ON COLUMN items.metadata IS 'Flexible JSONB column for additional attributes';

-- =============================================
-- Indexes
-- =============================================

-- cfg_user indexes
CREATE INDEX IF NOT EXISTS idx_cfg_user_email ON cfg_user(email);
CREATE INDEX IF NOT EXISTS idx_cfg_user_is_active ON cfg_user(is_active);
CREATE INDEX IF NOT EXISTS idx_cfg_user_created_at ON cfg_user(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cfg_user_email_active ON cfg_user(email, is_active);
CREATE INDEX IF NOT EXISTS idx_cfg_user_scopes ON cfg_user USING gin(scopes);

-- cfg_api_key indexes
CREATE INDEX IF NOT EXISTS idx_cfg_api_key_key_hash ON cfg_api_key(key_hash);
CREATE INDEX IF NOT EXISTS idx_cfg_api_key_user_id ON cfg_api_key(user_id);
CREATE INDEX IF NOT EXISTS idx_cfg_api_key_is_active ON cfg_api_key(is_active);
CREATE INDEX IF NOT EXISTS idx_cfg_api_key_hash_active ON cfg_api_key(key_hash, is_active);
CREATE INDEX IF NOT EXISTS idx_cfg_api_key_scopes ON cfg_api_key USING gin(scopes);

-- items indexes
CREATE INDEX IF NOT EXISTS idx_items_user_id ON items(user_id);
CREATE INDEX IF NOT EXISTS idx_items_status ON items(status);
CREATE INDEX IF NOT EXISTS idx_items_created_at ON items(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_items_user_status ON items(user_id, status);
CREATE INDEX IF NOT EXISTS idx_items_metadata ON items USING gin(metadata);

-- =============================================
-- Functions
-- =============================================

-- Automatic updated_at timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION update_updated_at() IS 'Trigger function to auto-update updated_at timestamp';

-- Update last_used_at for API keys
CREATE OR REPLACE FUNCTION update_api_key_last_used()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE cfg_api_key
    SET last_used_at = NOW()
    WHERE id = NEW.id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION update_api_key_last_used() IS 'Update last_used_at timestamp when API key is used';

-- =============================================
-- Triggers
-- =============================================

-- Apply updated_at to cfg_user
DROP TRIGGER IF EXISTS trg_cfg_user_updated_at ON cfg_user;
CREATE TRIGGER trg_cfg_user_updated_at
    BEFORE UPDATE ON cfg_user
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Apply updated_at to items
DROP TRIGGER IF EXISTS trg_items_updated_at ON items;
CREATE TRIGGER trg_items_updated_at
    BEFORE UPDATE ON items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

COMMIT;
