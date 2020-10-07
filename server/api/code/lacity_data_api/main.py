import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware

from .config import DEBUG
from .models import db
from .routers import (
    index, councils, regions, request_types, service_requests, shim, status
)

logger = logging.getLogger(__name__)


def get_app():
    app = FastAPI(title="LA City 311 Data API", debug=DEBUG)

    db.init_app(app)
    app.include_router(index.router)
    app.include_router(status.router, prefix="/status")
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
