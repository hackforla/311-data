from .dataService import DataService


class RequestDetailService(object):
    def __init__(self, config=None, tableName="ingest_staging_table"):
        self.dataAccess = DataService(config, tableName)

    async def get_request_detail(self, requestNumber=None):
        """
        Returns all properties tied to a service request given the srNumber
        {
          'LastPulled': 'Timestamp',
          'data': {
              'ncname':'String',
              'requesttype':'String',
              'srnumber':'String',
              'latitude': 'String',
              'longitude': 'String',
              'address': 'String',
              'createddate': 'Timestamp'
              .
              .
              .
            }
        }
        """

        items = ['*']
        filters = ['srnumber = \'{}\''.format(requestNumber)]
        result = self.dataAccess.query(items, filters)

        return result
