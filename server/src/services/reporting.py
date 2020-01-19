import pandas as pd
import sqlalchemy as db
from sqlalchemy.orm import sessionmaker
from sqlalchemy.types import Integer, Text, String, DateTime, Float
from sqlalchemy import create_engine
import tempfile

class reports(object):
    def __init__(self, config=None):
        self.config = config
        self.dbString = None if not self.config else self.config['Database']['DB_CONNECTION_STRING']
        pass

    def biggestOffenderCSV(self, startDate="2018-12-01", requestType="Bulky Items", councilName="HISTORIC HIGHLAND PARK NC"):
        '''Output data as CSV by council name, requset type, and
        start date (pulls to current date). Arguments should be passed
        as strings. Date values must be formatted %Y-%m-%d.'''
        engine = create_engine(self.dbString)

        sql = "SELECT * \
               FROM ingest_staging_table \
               WHERE CreatedDate > '{}' \
               AND RequestType = '{}' \
               AND NCName = '{}'"\
        .format(startDate, requestType, councilName)

        df = pd.read_sql_query(sql, engine)
        return df.to_csv()

if __name__ == "__main__":
    reportWorker = reports()
    #reportWorker.biggestOffenderCSV()
