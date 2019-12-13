import pandas as pd
from sqlalchemy.orm import sessionmaker
from sqlalchemy.types import Integer, Text, String, DateTime, Float
from sqlalchemy import create_engine

class reports(object):
    def __init__(self):
        pass

    def biggestOffenderCSV(self, dataset, startDate, requestType, councilName):
        '''Output data as CSV by council name, requset type, and
        start date (pulls to current date). Arguments should be passed
        as strings. Date values must be formatted %Y-%m-%d.'''
        # Query should resemble SELECT * FROM ingest_staging_table WHERE CreatedDate > startDate AND RequestType = requestType AND NCName = councilName
        engine = create_engine(self.dbString)
        df = pd.read_sql(query.statement, query.session.bind)
        #df = dataset.copy() # Shard deepcopy to allow multiple endpoints
        # Data filtering
        #dateFilter = df['CreatedDate'] > startDate
        #requestFilter = df['RequestType'] == requestType
        #councilFilter = df['NCName'] == councilName
        #df = df[dateFilter & requestFilter & councilFilter]
        # Return string object for routing to download
        return df.to_csv()

if __name__ == "__main__":
    reportWorker = reports()
    #reportWorker.biggestOffenderCSV()
