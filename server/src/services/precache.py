from configparser import ConfigParser
import sqlalchemy as db
import numpy as np
import pandas as pd
import json
from datetime import datetime
import matplotlib.pyplot as plt


class precache(object):
    def __init__(self, config=None, tableName="ingest_staging_table"):
        self.config = config
        self.dbString = None if not self.config  \
            else self.config['Database']['DB_CONNECTION_STRING']

        self.table = tableName
        self.data = None
        pass

    def recent_data(self, window, requestType, council):
        engine = db.create_engine(self.dbString)

        now = datetime.now()
        startdate = pd.Timestamp(now) - pd.Timedelta(days=window)

        query = "SELECT createddate, requesttype, ncname FROM %s WHERE createddate > '%s'" % (
            self.table, startdate)

        if requestType != "all":
            query += " AND requesttype = '%s'" % (requestType)
        if council != "all":
            query += " AND ncname = '%s'" % (council)

        df = pd.read_sql_query(query, con=engine)
        self.data = df
        
        # return json.loads(df.to_json())

    def compile_datasets(self, window=14, requestType='all', council='all'):
        self.recent_data(window, requestType, council)

        df = self.data

        request_arr = df.requesttype.unique()
        nc_arr = df.ncname.unique()

        df_arr = []
        for request in request_arr:
            dates = df['createddate'][df['requesttype'] == request]
            df_dates = pd.DataFrame({ request: dates })
            df_arr.append(json.loads(df_dates.to_json()))
        for nc in nc_arr:
            dates = df['createddate'][df['ncname'] == nc]
            df_dates = pd.DataFrame({ nc: dates })
            df_arr.append(json.loads(df_dates.to_json()))

        return df_arr

    # def compile_graphs(self):
    #     plt.hist(x=df['createddate'])
    #     plt.show()


if __name__ == "__main__":
    precache = precache()
    config = ConfigParser()
    config.read("../setting.cfg")
    precache.config = config
    precache.dbString = config['Database']['DB_CONNECTION_STRING']
    precache.compile_datasets(window=14)
