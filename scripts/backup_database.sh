#!/usr/bin/env bash
set -euo pipefail

DB_HOST="${MYAPP_DB_HOST:-localhost}"
DB_PORT="${MYAPP_DB_PORT:-5432}"
DB_NAME="${MYAPP_DB_NAME:-myapp}"
DB_USER="${MYAPP_DB_USER:-myapp}"
BACKUP_DIR="${BACKUP_DIR:-./backups}"
RETENTION_DAYS="${RETENTION_DAYS:-30}"

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/${DB_NAME}_${TIMESTAMP}.sql.gz"

mkdir -p "$BACKUP_DIR"

echo "Backing up ${DB_NAME} to ${BACKUP_FILE}..."
pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" "$DB_NAME" | gzip > "$BACKUP_FILE"

echo "Cleaning up backups older than ${RETENTION_DAYS} days..."
find "$BACKUP_DIR" -name "*.sql.gz" -mtime "+${RETENTION_DAYS}" -delete

echo "Backup complete: $(du -h "$BACKUP_FILE" | cut -f1)"
