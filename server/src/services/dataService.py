import datetime
import pandas as pd
from .databaseOrm import Ingest
from utils.database import db


class DataService(object):
    default_table = Ingest.__tablename__

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

        requestTypes = (', ').join([f"'{rt}'" for rt in requestTypes])
        ncList = (', ').join([str(nc) for nc in ncList])
        return f"""
            createddate >= '{startDate}' AND
            createddate <= '{endDate}' AND
            requesttype IN ({requestTypes}) AND
            nc IN ({ncList})
        """

    def comparisonFilters(self,
                          startDate=None,
                          endDate=None,
                          requestTypes=[],
                          ncList=[],
                          cdList=[]):
        '''
        Generates filters for the comparison endpoints.
        '''

        requestTypes = (', ').join([f"'{rt}'" for rt in requestTypes])
        if len(ncList) > 0:
            ncList = (', ').join([str(nc) for nc in ncList])
            return f"""
                createddate >= '{startDate}' AND
                createddate <= '{endDate}' AND
                requesttype IN ({requestTypes}) AND
                nc IN ({ncList})
            """
        else:
            cdList = (', ').join([str(cd) for cd in cdList])
            return f"""
                createddate >= '{startDate}' AND
                createddate <= '{endDate}' AND
                requesttype IN ({requestTypes}) AND
                cd IN ({cdList})
            """

    def itemQuery(self, requestNumber, table=default_table):
        '''
        Returns a single request by its requestNumber.
        '''

        if not requestNumber or not isinstance(requestNumber, str):
            return {'Error': 'Missing request number'}

        rows = db.exec_sql(f"""
            SELECT * FROM {table}
            WHERE srnumber = '{requestNumber}'
        """)

        rows = [dict(row) for row in rows]

        if len(rows) > 0:
            return rows[0]
        else:
            return {'Error': 'Request number not found'}

    def query(self, fields, filters, table=default_table):
        if not fields or not filters:
            return {'Error': 'fields and filters are required'}

        fields = (', ').join(fields)
        return pd.read_sql(f"""
            SELECT {fields}
            FROM {table}
            WHERE {filters}
        """, db.engine)

    def aggregateQuery(self, fields, filters, table=default_table):
        '''
        Returns the counts of distinct values in the specified fields,
        after filtering.
        '''

        if not fields or not isinstance(fields, list):
            return {'Error': 'Missing count fields'}

        df = self.query(fields, filters, table)

        return [{
            'field': field,
            'counts': df.groupby(by=field).size().to_dict()
        } for field in fields if field in df.columns]
