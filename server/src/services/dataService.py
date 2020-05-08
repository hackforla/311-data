import datetime
import pandas as pd
from .databaseOrm import Ingest as Request
from utils.database import db


class DataService(object):
    def __init__(self, config=None, tableName="ingest_staging_table"):
        pass

    async def lastPulled(self):
        # Will represent last time the ingest pipeline ran
        return datetime.datetime.utcnow()

    def standardFilters(self,
                        startDate=None,
                        endDate=None,
                        requestTypes=[],
                        ncList=[]):
        '''
        Generates filters for dates, request types, and ncs.
        '''
        return [
            Request.createddate > startDate if startDate else False,
            Request.createddate < endDate if endDate else False,
            Request.requesttype.in_(requestTypes),
            Request.nc.in_(ncList),
        ]

    def comparisonFilters(self,
                          startDate=None,
                          endDate=None,
                          requestTypes=[],
                          ncList=[],
                          cdList=[]):
        '''
        Generates filters for the comparison endpoints.
        '''
        return [
            Request.createddate > startDate if startDate else False,
            Request.createddate < endDate if endDate else False,
            Request.requesttype.in_(requestTypes),
            db.or_(Request.nc.in_(ncList), Request.cd.in_(cdList))
        ]

    def itemQuery(self, requestNumber):
        '''
        Returns a single request by its requestNumber.
        '''

        if not requestNumber or not isinstance(requestNumber, str):
            return {'Error': 'Missing request number'}

        fields = Request.__table__.columns.keys()
        if 'id' in fields:
            fields.remove('id')

        session = db.Session()
        record = session \
            .query(*fields) \
            .filter(Request.srnumber == requestNumber) \
            .first()
        session.close()

        if record:
            return record._asdict()
        else:
            return {'Error': 'Request number not found'}

    def query(self, queryItems=[], queryFilters=[], limit=None):
        '''
        Returns the specified properties of each request,
        after filtering by queryFilters and applying the limit.
        '''

        if not queryItems or not isinstance(queryItems, list):
            return {'Error': 'Missing query items'}

        selectFields = [getattr(Request, item) for item in queryItems]

        session = db.Session()
        records = session \
            .query(*selectFields) \
            .filter(*queryFilters) \
            .limit(limit) \
            .all()
        session.close()

        return [rec._asdict() for rec in records]

    def aggregateQuery(self, countFields=[], queryFilters=[]):
        '''
        Returns the counts of distinct values in the specified fields,
        after filtering by queryFilters.
        '''

        if not countFields or not isinstance(countFields, list):
            return {'Error': 'Missing count fields'}

        filteredData = self.query(countFields, queryFilters)
        df = pd.DataFrame(data=filteredData)

        return [{
            'field': field,
            'counts': df.groupby(by=field).size().to_dict()
        } for field in countFields if field in df.columns]

    def storedProc(self):
        pass
