import pandas as pd
from utils.database import db
from utils.picklebase import pb


class DataService(object):
    default_table = 'requests'

    def standardFilters(self,
                        startDate=None,
                        endDate=None,
                        requestTypes=[],
                        ncList=[]):
        '''
        Generates filters for dates, request types, and ncs.
        '''
        if pb.available():
            return {
                'startDate': startDate,
                'endDate': endDate,
                'requestTypes': requestTypes,
                'ncList': ncList}

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
        if pb.available():
            return {
                'startDate': startDate,
                'endDate': endDate,
                'requestTypes': requestTypes,
                'ncList': ncList,
                'cdList': cdList}

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

        if pb.available():
            return pb.query(table, fields, filters)

        fields = (', ').join(fields)
        return pd.read_sql(f"""
            SELECT {fields}
            FROM {table}
            WHERE {filters}
        """, db.engine)
