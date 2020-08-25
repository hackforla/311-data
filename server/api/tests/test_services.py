import pytest
from services import nc, map, requests, visualizations

"""
These are 'unit tests' of the key API services.

However, these tests run on a live database and assume that data
from the first 1/2 of 2020 have been loaded.
The zoom and boundaries assume the initial view of the map when first loaded.

TO-DO: refactor this with database fixtures or mocks.
"""

START_DATE = '2020-01-01 00:00:00'
END_DATE = '2020-06-30 00:00:00'
ZOOM = 10
BOUNDS = {'east': -117.67318725585939,
            'north': 34.397844946449865,
            'south': 33.61919376817004,
            'west': -119.52850341796876}
OPTIONS = {}


def test_ncs():
    """Test for a list of 104 NCs"""
    nc_list = nc.get_ncs()
    assert isinstance(nc_list, list)
    assert len(nc_list) == 104


def test_request_types():
    """Test for a list of 12 request types"""
    type_list = nc.get_request_types()

    assert isinstance(type_list, list)
    assert len(type_list) == 12


def test_item_query():
    sr_item = requests.item_query('1-1523593502')
    assert isinstance(sr_item, dict)
    assert sr_item['requesttype'] == 'Graffiti Removal'
    assert sr_item['nc'] == 125
    assert sr_item['latitude'] == 34.00466746
    assert sr_item['longitude'] == -118.2633146


@pytest.mark.asyncio
async def test_pin_clusters():
    counts = [187041, 42310, 45092, 347796, 37089, 21713, 14611]
    i = 0
    nc_list = nc.get_ncs()
    type_list = nc.get_request_types()
    data = await map.pin_clusters(START_DATE,
                                    END_DATE,
                                    type_list,
                                    nc_list,
                                    ZOOM,
                                    BOUNDS,
                                    OPTIONS)

    assert len(data) == 7
    for pin in data:
        assert pin['count'] == counts[i]
        i += 1


@pytest.mark.asyncio
async def test_heatmap():
    nc_list = nc.get_ncs()
    type_list = nc.get_request_types()

    data = await map.heatmap(START_DATE,
                                END_DATE,
                                type_list,
                                nc_list)

    assert len(data) == 695652


@pytest.mark.asyncio
async def test_visualizations():
    nc_list = nc.get_ncs()
    type_list = nc.get_request_types()

    data = await visualizations.visualizations(START_DATE,
                                                END_DATE,
                                                type_list,
                                                nc_list)

    # would like to find a better assert
    assert len(data) == 3
