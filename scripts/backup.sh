#!/usr/bin/env sh
# Placeholder: back up the practicum database with mongodump.
# Replace every REPLACE_ME value before running outside this lab.
set -eu

MONGO_URI="${MONGO_URI:-mongodb://REPLACE_ME:REPLACE_ME@localhost:27017/?authSource=admin}"
DB_NAME="${MONGO_DB:-practicum}"
OUT_DIR="${BACKUP_DIR:-./backups}"

mkdir -p "$OUT_DIR"
echo "Placeholder backup: $DB_NAME -> $OUT_DIR"
# Uncomment after setting real credentials:
# mongodump --uri "$MONGO_URI" --db "$DB_NAME" --out "$OUT_DIR"
