import pysupercluster
import hashlib
import json
import cache
from settings import Server
from . import requests


def get_pins_cache_key(filters):
    """
    Utility function to create hashed key for pins based on filters
    """
    filters_json = json.dumps(str(filters), sort_keys=True).encode('utf-8')
    hashed_json = hashlib.md5(filters_json).hexdigest()
    return 'filters:{}:pins'.format(hashed_json)


def get_pins(filters):
    """
    Get pins based on filters
    """
    key = get_pins_cache_key(filters)
    # try getting pins from cache
    pins = cache.get(key)

    if pins is None:
        if Server.DEBUG:
            print('\033[93m' + "Pin request cache miss" + '\033[0m')
        # try getting pins from DB
        pins = requests.standard_query([
            'srnumber',
            'requesttype',
            'latitude',
            'longitude'
        ], filters, table='map')

        # add result to cache
        cache.set(key, pins)
    else:
        if Server.DEBUG:
            print('\033[92m' + "Pin request cache hit" + '\033[0m')

    return pins


def get_clusters_for_pins(pins, zoom, bounds, options):
    """
    Cluster pins into aggregate values using pysupercluster
    based on filters and user view
    """
    if len(pins) == 0:
        return []

    min_zoom = options.get('min_zoom', 0)
    max_zoom = options.get('max_zoom', 17)
    radius = options.get('radius', 200)
    extent = options.get('extent', 512)

    index = pysupercluster.SuperCluster(
        pins[['longitude', 'latitude']].to_numpy(),
        min_zoom=min_zoom,
        max_zoom=max_zoom,
        radius=radius,
        extent=extent)

    north = bounds.get('north', 90)
    south = bounds.get('south', -90)
    west = bounds.get('west', -180)
    east = bounds.get('east', 180)

    clusters = index.getClusters(
        top_left=(west, north),
        bottom_right=(east, south),
        zoom=zoom)

    for cluster in clusters:
        if cluster['count'] == 1:
            pin = pins.iloc[cluster['id']]
            cluster['srnumber'] = pin['srnumber']
            cluster['requesttype'] = pin['requesttype']
            del cluster['expansion_zoom']

    return clusters


async def pin_clusters(startDate,
                        endDate,
                        requestTypes=[],
                        ncList=[],
                        zoom=0,
                        bounds={},
                        options={}):
    """
    Get the pins (data points) for a set of filters and group them
    into clusters based on the user zoom level and view bounds
    """

    filters = {
        'startDate': startDate,
        'endDate': endDate,
        'requestTypes': requestTypes,
        'ncList': ncList}

    if Server.DEBUG:
        print('\033[92m' + "Zoom: " + str(zoom) + '\033[0m')

    pins = get_pins(filters)
    return get_clusters_for_pins(pins, zoom, bounds, options)


async def heatmap(startDate,
                  endDate,
                  requestTypes=[],
                  ncList=[]):

    filters = {
        'startDate': startDate,
        'endDate': endDate,
        'requestTypes': requestTypes,
        'ncList': ncList}

    key = get_pins_cache_key(filters)

    # NOTE: pins get pulled for heatmap from cache (disk) even though it was
    # just added by pin cluster function. might refactor to in-memory cache
    pins = cache.get(key)

    fields = ['latitude', 'longitude']
    if pins is None:
        pins = requests.standard_query(fields, filters, table='map')
    else:
        pins = pins[fields]

    return pins.to_numpy()


# seems to be unused. remove?
async def pins(startDate,
               endDate,
               requestTypes=[],
               ncList=[]):

    filters = {
        'startDate': startDate,
        'endDate': endDate,
        'requestTypes': requestTypes,
        'ncList': ncList}

    pins = get_pins(filters)
    return pins.to_dict(orient='records')
