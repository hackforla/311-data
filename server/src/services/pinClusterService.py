import pysupercluster
import pandas as pd
import hashlib
import json
from utils.redis import cache
from .dataService import DataService


class PinClusterService(object):
    def __init__(self, config=None):
        self.config = config

    def pins_key(self, filters):
        filters_json = json.dumps(filters, sort_keys=True).encode('utf-8')
        hashed_json = hashlib.md5(filters_json).hexdigest()
        return 'filters:{}:pins'.format(hashed_json)

    def get_pins(self, filters):
        key = self.pins_key(filters)
        pins = cache.get(key)

        if pins is None:
            dataAccess = DataService()

            fields = [
                'srnumber',
                'requesttype',
                'latitude',
                'longitude']

            filters = dataAccess.standardFilters(
                filters['startDate'],
                filters['endDate'],
                filters['requestTypes'],
                filters['ncList'])

            pins = dataAccess.query(fields, filters)
            pins = pd.DataFrame(pins, columns=fields)

            cache.set(key, pins)

        return pins

    def pin_clusters(self, pins, zoom, bounds, options={}):
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

    async def get_pin_clusters(self, filters, zoom, bounds, options):
        pins = self.get_pins(filters)
        return self.pin_clusters(pins, zoom, bounds, options)
