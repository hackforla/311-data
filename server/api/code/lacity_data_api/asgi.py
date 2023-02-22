import sentry_sdk
from sentry_sdk.integrations.asgi import SentryAsgiMiddleware
from sentry_sdk.integrations.sqlalchemy import SqlalchemyIntegration
from sentry_sdk.integrations.redis import RedisIntegration


from .config import SENTRY_URL
from .main import get_app


app = get_app()

sample_rate_for_api_calls = {
    "/status/api": 0.01,
}


def traces_sampler(ctx):
    # return sample rate based on path_name
    # if sample rate is not defined trace all
    path_name = ctx["asgi_scope"].get("path")
    return sample_rate_for_api_calls.get(path_name, 1.0)


if SENTRY_URL:
    sentry_sdk.init(
        SENTRY_URL,
        traces_sampler=traces_sampler,
        integrations=[SqlalchemyIntegration(), RedisIntegration()],
    )
    app = SentryAsgiMiddleware(app)
