import sentry_sdk
from sentry_sdk.integrations.asgi import SentryAsgiMiddleware
from sentry_sdk.integrations.sqlalchemy import SqlalchemyIntegration

from .config import SENTRY_URL
from .main import get_app


app = get_app()

if SENTRY_URL:
    sentry_sdk.init(
        SENTRY_URL,
        traces_sample_rate=1.0,
        integrations=[SqlalchemyIntegration()]
    )
    app = SentryAsgiMiddleware(app)
