import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware

from .routers import index, councils, regions, request_types, service_requests
from .models import db

try:
    from importlib.metadata import entry_points
except ImportError:  # pragma: no cover
    from importlib_metadata import entry_points

logger = logging.getLogger(__name__)


def get_app():
    app = FastAPI(title="311 Data API")

    db.init_app(app)

    app.include_router(index.router)
    app.include_router(councils.router, prefix="/councils")
    app.include_router(regions.router, prefix="/regions")
    app.include_router(request_types.router, prefix="/types")
    app.include_router(service_requests.router, prefix="/requests")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.add_middleware(GZipMiddleware)

    return app
