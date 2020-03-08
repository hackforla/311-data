from sqlalchemy import func
from .dataService import DataService
from .databaseOrm import Ingest as Request


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

        # filter by date, nc, and requestType (if provided)
        filters = [
            Request.createddate > startDate if startDate else True,
            Request.createddate < endDate if endDate else True,
            Request.ncname.in_(ncList) if ncList else True,
            Request.requesttype.in_(requestTypes) if requestTypes else True
        ]

        data = []
        for field in countFields:
            # make sure the field exists in the Request model
            if not getattr(Request, field, None):
                continue

            # run count/groupby query
            results = self.dataAccess.session \
                .query(field, func.count()) \
                .filter(*filters) \
                .group_by(field) \
                .all()

            # add results to data set
            data.append({
                'field': field,
                'counts': dict(results)
            })

        return DataService.withMeta(data)
