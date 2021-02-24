import os

from sqlalchemy.engine.url import URL, make_url
from starlette.config import Config
from starlette.datastructures import Secret


# Load (optional) .env file from server/api directory
CONF_FILE = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
    ".env"
)
config = Config(CONF_FILE)

# checking for testing or debug
DEBUG = config("DEBUG", cast=bool, default=False)
SHOW_ENV = config("SHOW_ENV", cast=bool, default=False)
TESTING = config("TESTING", cast=bool, default=False)
STAGE = config("STAGE", default="Local")

# string array of allows client URLs
API_ALLOWED_ORIGINS = config(
    "API_ALLOWED_ORIGINS",
    default=["http://localhost:3000", "https://dev.311-data.org"]
)

# getting database configuration
DB_DRIVER = config("DB_DRIVER", default="postgresql")
DB_HOST = config("DB_HOST", default="localhost")
DB_PORT = config("DB_PORT", cast=int, default=5432)
DB_USER = config("DB_USER", default="311_user")
DB_PASSWORD = config("DB_PASS", cast=Secret, default=None)
DB_DATABASE = config("DB_NAME", default="311_db")

if TESTING:
    if DB_DATABASE and DB_DATABASE[-5:] != "_test":
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

DB_POOL_MIN_SIZE = config("DB_POOL_MIN_SIZE", cast=int, default=1)
DB_POOL_MAX_SIZE = config("DB_POOL_MAX_SIZE", cast=int, default=16)
DB_ECHO = config("DB_ECHO", cast=bool, default=False)
DB_SSL = config("DB_SSL", default=None)
DB_USE_CONNECTION_FOR_REQUEST = config(
    "DB_USE_CONNECTION_FOR_REQUEST", cast=bool, default=True
)
DB_RETRY_LIMIT = config("DB_RETRY_LIMIT", cast=int, default=32)
DB_RETRY_INTERVAL = config("DB_RETRY_INTERVAL", cast=int, default=1)

# print out debug information
if SHOW_ENV:
    print("\n\033[93mLA City Data API server starting with DEBUG mode ENABLED\033[0m")
    print("\nEnvironment variables after executing config.py file:")
    for k, v in sorted(os.environ.items()):
        print(f'{k}: {v}')
    print(f"\n\033[93mDatabase\033[0m: {DB_DSN}\n")

# set up endpoint for REDIS cache
CACHE_ENDPOINT = config('CACHE_ENDPOINT', default="localhost")
CACHE_MAX_RETRIES = config('CACHE_MAX_RETRIES', cast=int, default=5)
CACHE_MAXMEMORY = config('CACHE_MAXMEMORY', cast=int, default=262144000)

# set up GitHub data
GITHUB_TOKEN = config('GITHUB_TOKEN', default=None)
GITHUB_ISSUES_URL = config('GITHUB_ISSUES_URL', default=None)
GITHUB_PROJECT_URL = config('GITHUB_PROJECT_URL', default=None)
GITHUB_SHA = config('GITHUB_SHA', default="DEVELOPMENT")
GITHUB_CODE_VERSION = config('GITHUB_CODE_VERSION', default="ALPHA")

# Sendgrid email
SENDGRID_API_KEY = config('SENDGRID_API_KEY', default=None)

# Sentry URL
SENTRY_URL = config('SENTRY_URL', default=None)
