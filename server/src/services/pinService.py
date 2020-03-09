from .dataService import DataService


class PinService(object):
    def __init__(self, config=None, tableName="ingest_staging_table"):
        self.dataAccess = DataService(config, tableName)

    async def get_base_pins(self,
                            startDate=None,
                            endDate=None,
                            ncList=[],
                            requestTypes=[]):
        """
        Returns the base pin data given times, ncs, and request filters
        {
          'LastPulled': 'Timestamp',
          'data': [
            {
              'srnumber':'String',
              'latitude': 'String',
              'longitude': 'String',
            }
          ]
        }
        """

        items = ['srnumber',
                 'latitude',
                 'longitude']

        filters = self.dataAccess.standardFilters(
            startDate, endDate, ncList, requestTypes)

        return self.dataAccess.query(items, filters)
