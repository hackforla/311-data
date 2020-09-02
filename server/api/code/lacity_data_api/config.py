import os
from sqlalchemy.engine.url import URL, make_url
from starlette.config import Config, environ
from starlette.datastructures import Secret

config = Config(".env")

# checking for testing or debug
DEBUG = config("DEBUG", cast=bool, default=False)
TESTING = config("TESTING", cast=bool, default=False)

# getting database configuration
DB_DRIVER = config("DB_DRIVER", default="postgresql")
DB_HOST = config("DB_HOST", default=None)
DB_PORT = config("DB_PORT", cast=int, default=None)
DB_USER = config("DB_USER", default=None)
DB_PASSWORD = config("DB_PASSWORD", cast=Secret, default=None)
DB_DATABASE = config("DB_DATABASE", default=None)

if TESTING:
    if DB_DATABASE:
        DB_DATABASE += "_test"

DB_DSN = config(
    "DB_DSN",
    cast=make_url,
    default=URL(
        drivername=DB_DRIVER,
        username=DB_USER,
        password=DB_PASSWORD,
        host=DB_HOST,
        port=DB_PORT,
        database=DB_DATABASE,
    ),
)

if TESTING:
    if DB_DSN:
        DB_DSN += "_test"

DB_POOL_MIN_SIZE = config("DB_POOL_MIN_SIZE", cast=int, default=1)
DB_POOL_MAX_SIZE = config("DB_POOL_MAX_SIZE", cast=int, default=16)
DB_ECHO = config("DB_ECHO", cast=bool, default=True)
DB_SSL = config("DB_SSL", default=None)
DB_USE_CONNECTION_FOR_REQUEST = config(
    "DB_USE_CONNECTION_FOR_REQUEST", cast=bool, default=True
)
DB_RETRY_LIMIT = config("DB_RETRY_LIMIT", cast=int, default=32)
DB_RETRY_INTERVAL = config("DB_RETRY_INTERVAL", cast=int, default=1)

# check whether running in legacy mode
API_LEGACY_MODE = config('API_LEGACY_MODE', cast=bool, default=False)

# the legacy code needs these created as environment settings
if API_LEGACY_MODE:
    environ['DATABASE_URL'] = str(DB_DSN)
    environ['TMP_DIR'] = config('TEMP_FOLDER')
    environ['PICKLECACHE_ENABLED'] = config('USE_FILE_CACHE')

# print out debug information
if DEBUG:
    print("\n\033[93mLA City Data API server starting with DEBUG mode ENABLED\033[0m")
    print("\nEnvironment variables after executing config.py file:")
    for k, v in sorted(os.environ.items()):
        print(f'\033[92m{k}\033[0m: {v}')
    print(f"\n\033[93mDatabase\033[0m: {DB_DSN}\n")
