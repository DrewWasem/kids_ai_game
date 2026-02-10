-- Migration: V00N__description.sql
-- Date: YYYY-MM-DD
-- Description: [Brief description of what this migration does]
-- Author: [Your name]

-- =============================================
-- IMPORTANT: Migration Guidelines
-- =============================================
-- 1. Never modify existing migrations - create a new one
-- 2. Always use IF EXISTS/IF NOT EXISTS for idempotency
-- 3. Test rollback before deploying
-- 4. Update version number sequentially (V002, V003, etc.)
-- 5. Include both forward and rollback scripts
-- =============================================

BEGIN;

-- Your migration SQL here
-- Example:
-- CREATE TABLE IF NOT EXISTS new_table (
--     id SERIAL PRIMARY KEY,
--     name TEXT NOT NULL,
--     created_at TIMESTAMP NOT NULL DEFAULT NOW()
-- );

-- CREATE INDEX IF NOT EXISTS idx_new_table_name ON new_table(name);

COMMIT;

-- =============================================
-- Rollback Script (save separately as R00N__description.sql)
-- =============================================
-- BEGIN;
-- DROP INDEX IF EXISTS idx_new_table_name;
-- DROP TABLE IF EXISTS new_table CASCADE;
-- COMMIT;
