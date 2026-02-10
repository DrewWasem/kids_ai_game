-- Additional Performance Indexes
-- File: sql/01_core/03_indexes.sql
-- Description: Additional indexes for performance optimization

-- Composite indexes for common query patterns

-- User lookups with active status filter
CREATE INDEX IF NOT EXISTS idx_cfg_user_email_active ON cfg_user(email, is_active);

-- API key validation queries (hash + active status)
CREATE INDEX IF NOT EXISTS idx_cfg_api_key_hash_active ON cfg_api_key(key_hash, is_active);

-- Items by user and status (common filtering pattern)
CREATE INDEX IF NOT EXISTS idx_items_user_status ON items(user_id, status);

-- Items metadata JSONB index (for JSONB queries)
CREATE INDEX IF NOT EXISTS idx_items_metadata ON items USING gin(metadata);

-- User scopes for permission checks
CREATE INDEX IF NOT EXISTS idx_cfg_user_scopes ON cfg_user USING gin(scopes);

-- API key scopes for permission checks
CREATE INDEX IF NOT EXISTS idx_cfg_api_key_scopes ON cfg_api_key USING gin(scopes);
