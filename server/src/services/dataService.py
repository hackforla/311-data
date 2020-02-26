import sqlalchemy as db
import pandas as pd


class DataService(object):
    def includeMeta(func):
        def inner1(*args, **kwargs):
            dataResponse = func(*args, **kwargs)
            if 'Error' in dataResponse:
                return dataResponse

            withMeta = {'lastPulled': 'NOW', 'data': dataResponse}
            return withMeta

        return inner1

    def __init__(self, config=None, tableName="ingest_staging_table"):
        self.config = config
        self.dbString = None if not self.config  \
            else self.config['Database']['DB_CONNECTION_STRING']

        self.table = tableName
        self.data = None
        self.engine = db.create_engine(self.dbString)

    @includeMeta
    def query(self, queryItems=None, queryfilters=[], limit=None):
        if not queryItems or not isinstance(queryItems, list):
            return {'Error': 'Missing query items'}

        items = ', '.join(queryItems)
        query = 'SELECT {} FROM {}'.format(items, self.table)
        if queryfilters:
            filters = ' AND '.join(queryfilters)
            query += ' WHERE {}'.format(filters)
        if limit:
            query += ' LIMIT {}'.format(limit)

        df = pd.read_sql_query(query, con=self.engine)
        return df.to_dict(orient='records')

    def storedProc(self):
        pass
