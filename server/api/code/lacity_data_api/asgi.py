import sentry_sdk
from sentry_sdk.integrations.asgi import SentryAsgiMiddleware
from sentry_sdk.integrations.sqlalchemy import SqlalchemyIntegration

from .main import get_app


app = get_app()

sentry_sdk.init(
    "https://467b42786c584f87ae7a7760f96b5652@o452210.ingest.sentry.io/5439266",
    traces_sample_rate=1.0,
    integrations=[SqlalchemyIntegration()]
)

app = SentryAsgiMiddleware(app)
