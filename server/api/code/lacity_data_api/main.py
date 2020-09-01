import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware

from .routers import (
    index, legacy, councils, regions, request_types, service_requests, shim
)
from .models import db
from .config import API_LEGACY_MODE


logger = logging.getLogger(__name__)


def get_app():
    app = FastAPI(title="LA City 311 Data API")

    db.init_app(app)
    app.include_router(index.router)

    if API_LEGACY_MODE:
        app.include_router(legacy.router)
    else:
        app.include_router(shim.router)

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
