-- Core Database Functions
-- File: sql/01_core/02_functions.sql
-- Description: Utility functions and triggers

-- Automatic updated_at timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION update_updated_at() IS 'Trigger function to auto-update updated_at timestamp';

-- Apply to cfg_user
DROP TRIGGER IF EXISTS trg_cfg_user_updated_at ON cfg_user;
CREATE TRIGGER trg_cfg_user_updated_at
    BEFORE UPDATE ON cfg_user
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Apply to items
DROP TRIGGER IF EXISTS trg_items_updated_at ON items;
CREATE TRIGGER trg_items_updated_at
    BEFORE UPDATE ON items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

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
