from .dataService import DataService


class PinService(object):
    def __init__(self, config=None, tableName="ingest_staging_table"):
        self.dataAccess = DataService(config, tableName)

    async def get_base_pins(self,
                            startDate='',
                            endDate='',
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

        ncs = '\'' + '\', \''.join(ncList) + '\''
        requests = '\'' + '\', \''.join(requestTypes) + '\''

        filters = ['createddate > \'{}\''.format(startDate),
                   'createddate < \'{}\''.format(endDate),
                   'ncname IN ({})'.format(ncs),
                   'requesttype IN ({})'.format(requests)]
        result = self.dataAccess.query(items, filters)

        return result
