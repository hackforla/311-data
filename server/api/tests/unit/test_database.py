from datetime import datetime
import os

import pytest

from lacity_data_api.models import db
from lacity_data_api.models.council import Council
from lacity_data_api.models.region import Region
from lacity_data_api.models.request_type import RequestType
from lacity_data_api.models.service_request import ServiceRequest

"""
These are 'unit tests' of the database models bypassing the API.

However, these tests run on a live database and assume that data
from the first 10K records of 2020 have been loaded.

"""


def setup_function(function):
    print(f"With test DB ({os.getenv('DATABASE_URL')}) setting up", function)


@pytest.mark.asyncio
async def test_alembic_version():
    query = db.text("SELECT version_num FROM alembic_version")
    result = await db.first(query)
    assert result[0] == "8f2ffbc5c2e8"


@pytest.mark.asyncio
async def test_last_updated():
    query = db.text("SELECT last_pulled FROM metadata")
    result = await db.first(query)
    assert result[0].replace(tzinfo=None) > datetime.strptime("2020-01-01", '%Y-%m-%d')


@pytest.mark.asyncio
async def test_councils():
    result = await db.all(Council.query)
    assert len(result) == 99


@pytest.mark.asyncio
async def test_regions():
    result = await db.all(Region.query)
    assert len(result) == 12


@pytest.mark.asyncio
async def test_request_types():
    result = await db.all(RequestType.query)
    assert len(result) == 12


@pytest.mark.asyncio
async def test_service_requests():
    result = await db.all(ServiceRequest.query)
    assert len(result) == 9883


@pytest.mark.asyncio
async def test_map_view():
    query = db.text("SELECT count(*) FROM map")
    result = await db.scalar(query)
    assert result == 9989


@pytest.mark.asyncio
async def test_vis_view():
    query = db.text("SELECT count(*) FROM vis")
    result = await db.scalar(query)
    assert result == 10000


@pytest.mark.asyncio
async def test_requests():
    query = db.text("SELECT count(*) FROM requests")
    result = await db.scalar(query)
    assert result == 10000
