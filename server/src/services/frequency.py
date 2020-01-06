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
        pass

    def freq_query(self):
        engine = db.create_engine(self.dbString)

        connection = engine.connect()
        query = "SELECT row_to_json(row(status)) \
            FROM ingest_staging_table"
        result = connection.execute(query)
        connection.close()

        return result

    def freq_summary(self):
        engine = db.create_engine(self.dbString)

        query = "SELECT * FROM %s" % (self.table)
        df = pd.read_sql_query(query, con=engine)

        return df.describe().to_json()


if __name__ == "__main__":
    freq = frequency()
    config = ConfigParser()
    config.read("../setting.cfg")
    freq.config = config
    freq.dbString = config['Database']['DB_CONNECTION_STRING']
    freq.freq_summary()
