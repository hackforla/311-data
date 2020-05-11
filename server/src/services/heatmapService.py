import pandas as pd
import hashlib
import json
from utils.redis import cache
from .dataService import DataService


class HeatmapService(object):
    def __init__(self, config=None):
        self.config = config

    def pins_key(self, filters):
        filters_json = json.dumps(filters, sort_keys=True).encode('utf-8')
        hashed_json = hashlib.md5(filters_json).hexdigest()
        return 'filters:{}:pins'.format(hashed_json)

    async def get_heatmap(self, filters):
        key = self.pins_key(filters)
        pins = cache.get(key)

        fields = ['latitude', 'longitude']
        if pins is None:
            dataAccess = DataService()

            filters = dataAccess.standardFilters(
                filters['startDate'],
                filters['endDate'],
                filters['requestTypes'],
                filters['ncList'])

            pins = dataAccess.query(fields, filters, table='map')
            pins = pd.DataFrame(pins, columns=fields)
        else:
            pins = pins[fields]

        return pins.to_numpy()
