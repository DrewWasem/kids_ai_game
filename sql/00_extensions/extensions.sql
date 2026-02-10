-- Required PostgreSQL extensions
-- File: sql/00_extensions/extensions.sql
-- Description: Core PostgreSQL extensions for the application

-- pgcrypto - Required for UUID generation and password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;
