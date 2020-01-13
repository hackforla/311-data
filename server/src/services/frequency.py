from configparser import ConfigParser
import sqlalchemy as db
import pandas as pd
from datetime import datetime as dt
import numpy as np
import json


class frequency(object):
    def __init__(self, config=None, tableName="ingest_staging_table"):
        self.config = config
        self.dbString = None if not self.config else self.config['Database']['DB_CONNECTION_STRING']
        self.table = tableName
        self.data = None
        pass

    def freq_view_all(self, serviced=False):
        """
        Returns the request type and associated dates for all data
        Sorted by request type, followed by created date, service date (if applicable), and then closed date
        """
        # Todo: implement condition for serviced date
        engine = db.create_engine(self.dbString)

        query = "SELECT requesttype, createddate, closeddate FROM %s" % self.table
        df = pd.read_sql_query(query, con=engine)

        df['closeddate'] = pd.to_datetime(df['closeddate'])
        df = df.sort_values(by=['requesttype', 'createddate', 'closeddate'])

        return df.to_json(orient="records")

    def freq_aggregate(self):
        engine = db.create_engine(self.dbString)

        query = "SELECT requesttype FROM %s" % (self.table)
        df = pd.read_sql_query(query, con=engine)

        request_counts = df['requesttype'].value_counts()
        print(np.dtype(request_counts))
        
        # for request in request_types:
        #     print(df[request].value_counts())
        return df['requesttype'].value_counts()


if __name__ == "__main__":
    freq = frequency()
    config = ConfigParser()
    config.read("../setting.cfg")
    freq.config = config
    freq.dbString = config['Database']['DB_CONNECTION_STRING']
    freq.freq_aggregate()
