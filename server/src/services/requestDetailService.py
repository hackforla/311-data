from .dataService import DataService


class RequestDetailService(object):
    def __init__(self):
        self.dataAccess = DataService()

    async def get_request_detail(self, requestNumber=None):
        """
        Returns all properties tied to a service request given the srNumber
        {
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

        return self.dataAccess.itemQuery(requestNumber)
