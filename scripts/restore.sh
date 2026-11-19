#!/usr/bin/env sh
# Placeholder: restore the practicum database with mongorestore.
# Replace every REPLACE_ME value before running outside this lab.
set -eu

MONGO_URI="${MONGO_URI:-mongodb://REPLACE_ME:REPLACE_ME@localhost:27017/?authSource=admin}"
DB_NAME="${MONGO_DB:-practicum}"
SRC_DIR="${BACKUP_DIR:-./backups}"

echo "Placeholder restore: $SRC_DIR -> $DB_NAME"
# Uncomment after setting real credentials (--drop overwrites existing data):
# mongorestore --uri "$MONGO_URI" --db "$DB_NAME" --drop "$SRC_DIR/$DB_NAME"
