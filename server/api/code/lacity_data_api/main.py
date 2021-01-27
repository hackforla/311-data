import logging
import os

from fastapi import FastAPI
from fastapi.logger import logger as fastapi_logger
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware

from .config import DEBUG
from .models import db
from .routers import (
    index, councils, regions, request_types, service_requests, shim, status, geojson
)


if "gunicorn" in os.environ.get("SERVER_SOFTWARE", ""):
    '''
    When running with gunicorn the log handlers get suppressed instead of
    passed along to the container manager. This code forces the gunicorn handlers
    to be used throughout the project.
    '''
    gunicorn_error_logger = logging.getLogger("gunicorn.error")
    gunicorn_logger = logging.getLogger("gunicorn")
    uvicorn_access_logger = logging.getLogger("uvicorn.access")
    uvicorn_access_logger.handlers = gunicorn_error_logger.handlers

    fastapi_logger.handlers = gunicorn_error_logger.handlers


def get_app():
    app = FastAPI(title="LA 311 Data API", debug=DEBUG)

    db.init_app(app)
    app.include_router(index.router)
    app.include_router(status.router, prefix="/status")
    app.include_router(shim.router)
    app.include_router(councils.router, prefix="/councils")
    app.include_router(regions.router, prefix="/regions")
    app.include_router(request_types.router, prefix="/types")
    app.include_router(service_requests.router, prefix="/requests")
    app.include_router(geojson.router, prefix="/geojson")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.add_middleware(GZipMiddleware)

    return app
