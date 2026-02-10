-- Master Deployment Script
-- File: sql/deploy.sql
-- Description: Deploy all database objects in correct order
-- Usage: psql -d your_database -f sql/deploy.sql

\echo '========================================='
\echo 'Starting database deployment...'
\echo '========================================='

-- Set error handling
\set ON_ERROR_STOP on

-- Transaction wrapper
BEGIN;

\echo ''
\echo 'Step 1/4: Installing extensions...'
\i sql/00_extensions/extensions.sql

\echo ''
\echo 'Step 2/4: Creating tables...'
\i sql/01_core/01_tables.sql

\echo ''
\echo 'Step 3/4: Creating functions and triggers...'
\i sql/01_core/02_functions.sql

\echo ''
\echo 'Step 4/4: Creating indexes...'
\i sql/01_core/03_indexes.sql

COMMIT;

\echo ''
\echo '========================================='
\echo 'Deployment completed successfully!'
\echo '========================================='

-- Verification
\echo ''
\echo 'Verification: Checking installed tables...'
SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
    AND tablename IN ('cfg_user', 'cfg_api_key', 'items')
ORDER BY tablename;

\echo ''
\echo 'Verification: Checking installed extensions...'
SELECT
    extname as extension,
    extversion as version
FROM pg_extension
WHERE extname IN ('pgcrypto')
ORDER BY extname;
