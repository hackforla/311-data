#!/bin/bash
set -euo pipefail

if [ -v MIGRATE_DB ]; then
    alembic upgrade head
fi

exec python code/run.py
