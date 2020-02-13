from configparser import ConfigParser
import sqlalchemy as db
import numpy as np
import pandas as pd
import json
from datetime import datetime

class precache(object):
    def __init__(self, config=None, tableName="ingest_staging_table"):
        self.config = config
        self.dbString = None if not self.config  \
            else self.config['Database']['DB_CONNECTION_STRING']

        self.table = tableName
        self.data = None
        pass

    def recent_requests(self, requestType=None, council=None):
        engine = db.create_engine(self.dbString)

        now = datetime.now()
        startdate = pd.Timestamp(now) - pd.Timedelta(days=1400)

        query = "SELECT * FROM %s WHERE createddate > %s" % (self.table, startdate)

        df = pd.read_sql_query(query, con=engine)

        return json.loads(df.to_json())

if __name__ == "__main__":
    precache = precache()
    config = ConfigParser()
    config.read("../setting.cfg")
    precache.config = config
    precache.dbString = config['Database']['DB_CONNECTION_STRING']
    precache.recent_requests()

