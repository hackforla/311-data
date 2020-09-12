import pytest

from services import requests, map, visualizations

"""
These are 'unit tests' of the key API services.

However, these tests run on a live database and assume that data
from the first 10K records of 2020 have been loaded.

TO-DO: refactor this with database fixtures or mocks.
"""

START_DATE = '2020-01-01 00:00:00'
END_DATE = '2020-01-02 00:00:00'
NC_LIST = [
    29, 30, 32, 33, 34, 46, 52, 54, 55, 58, 60, 76, 97, 104, 119, 121, 128
]
TYPE_LIST = [
    "Bulky Items",
    "Dead Animal Removal",
    "Electronic Waste",
    "Graffiti Removal",
    "Homeless Encampment"
]
ZOOM = 12
BOUNDS = {
    "north": 34.182837768400596,
    "east": -118.12259674072267,
    "south": 33.98834915267798,
    "west": -118.59844207763673
}
OPTIONS = {}


def test_item_query():
    sr_item = requests.item_query('1-1523593502')
    assert isinstance(sr_item, dict)
    assert sr_item['requesttype'] == 'Graffiti Removal'
    assert sr_item['nc'] == 125
    assert sr_item['latitude'] == 34.00466746
    assert sr_item['longitude'] == -118.2633146


@pytest.mark.asyncio
async def test_pin_clusters():

    data = await map.pin_clusters(START_DATE,
                                    END_DATE,
                                    TYPE_LIST,
                                    NC_LIST,
                                    ZOOM,
                                    BOUNDS,
                                    OPTIONS)

    assert len(data) > 1


@pytest.mark.asyncio
async def test_heatmap():

    data = await map.heatmap(START_DATE,
                                END_DATE,
                                TYPE_LIST,
                                NC_LIST)

    assert len(data) == 220


@pytest.mark.asyncio
async def test_visualizations():

    data = await visualizations.visualizations(START_DATE,
                                                END_DATE,
                                                TYPE_LIST,
                                                NC_LIST)

    # would like to find a better assert
    assert len(data) == 3
