import os
import subprocess
from pathlib import Path
import asyncio

import pytest
from starlette.testclient import TestClient

from lacity_data_api.asgi import app


# set env setting to ensure test DB is used
os.environ["TESTING"] = "True"


# (!) this allows async io and starlette tests to coexist w/shared event loop
# guidance from https://github.com/pytest-dev/pytest-asyncio/issues/169
@pytest.fixture(scope="session")
def event_loop(request):
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope="session")
def client(event_loop):
    print(os.environ)
    cwd = Path(__file__).parent.parent

    # init the database
    subprocess.check_call(["alembic", "upgrade", "head"], cwd=cwd)

    # create the client for use by tests
    with TestClient(app) as client:
        yield client

    # reset the database
    subprocess.check_call(["alembic", "downgrade", "base"], cwd=cwd)
