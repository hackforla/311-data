from .dataService import DataService


class RequestCountsService(object):
    def __init__(self, config=None, tableName="ingest_staging_table"):
        self.dataAccess = DataService(config, tableName)

    async def get_req_counts(self,
                             startDate=None,
                             endDate=None,
                             ncList=[],
                             requestTypes=[],
                             countFields=[]):
        """
        For each countField, returns the counts of each distinct value
        in that field, given times, ncs, and request filters.
        E.g. if countsFields is ['requesttype', 'requestsource'], returns:
        {
            'lastPulled': 'Timestamp',
            'data': [
                {
                    'field': 'requesttype',
                    'counts': {
                        'Graffiti Removal': 'Int',
                        'Bulky Items': 'Int',
                        ...
                    }
                },
                {
                    'field': 'requestsource',
                    'counts': {
                        'Mobile App': 'Int',
                        'Driver Self Report': 'Int',
                        ...
                    }
                }
            ]
        }
        """

        filters = self.dataAccess.standardFilters(
            startDate, endDate, ncList, requestTypes)

        return self.dataAccess.aggregateQuery(countFields, filters)
