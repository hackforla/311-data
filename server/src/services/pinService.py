from .dataService import DataService


class PinService(object):
    def __init__(self, config=None, tableName="ingest_staging_table"):
        self.dataAccess = DataService(config, tableName)

    async def get_base_pins(self,
                            startDate=None,
                            endDate=None,
                            requestTypes=[],
                            ncList=[]):
        """
        Returns the base pin data given times, ncs, and request filters
        {
          'data': [
            {
              'srnumber':'String',
              'requesttype': 'String',
              'latitude': 'String',
              'longitude': 'String',
            }
          ]
        }
        """

        items = ['srnumber',
                 'requesttype',
                 'latitude',
                 'longitude']

        filters = self.dataAccess.standardFilters(
            startDate, endDate, requestTypes, ncList)

        return self.dataAccess.query(items, filters)
