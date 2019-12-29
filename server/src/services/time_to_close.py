from configparser import ConfigParser
import sqlalchemy as db
import pandas as pd
from datetime import datetime as dt
import numpy as np

class time_to_close(object):
    def __init__(self, config=None, tableName="ingest_staging_table"):
        """
        Choose table from database by setting the value of tableName. Default table is the staging table.
        """
        self.config = config
        self.dbString = None if not self.config else self.config['Database']['DB_CONNECTION_STRING']
        self.table = tableName
        self.data = None
        pass

    def ttc_view_columns(self):
        """
        Returns all the columns' names
        """
        engine = db.create_engine(self.dbString)

        df = pd.read_sql_query("SELECT * FROM %s" % self.table, con=engine)

        return df
        
    def ttc_view_table(self, onlyClosed=False):
        """
        Returns all entries
        Returns only those with Status as 'Closed' if onlyClosed is set to True
        """
        engine = db.create_engine(self.dbString)

        # The following directly converts SQL data to json objects; for consistency, this function first converts the SQL data to pandas dataframe
        # connection = engine.connect()
        # query = "SELECT row_to_json(ingest_staging_table) \
        #     FROM ingest_staging_table"
        # result = connection.execute(query)
        # connection.close()

        if onlyClosed:
            df = pd.read_sql_query("SELECT * FROM %s WHERE Status = 'Closed'" % self.table, con=engine)
        else:
            df = pd.read_sql_query("SELECT * FROM %s" % self.table, con=engine)

        return df.to_json(orient='index')

    def ttc_created_closed_time(self, serviced=False):
        """
        Returns all rows under the CreatedDate and ClosedDate columns in ISO8601 format
        Returns all rows with a service date under CreatedDate, ClosedDate, and ServicedDate columns if serviced is True
        """
        engine = db.create_engine(self.dbString)

        if serviced:
            df = pd.read_sql_query("SELECT createddate, closeddate, servicedate FROM %s" % self.table, con=engine)
            df = df[df['servicedate'].notnull()]
            print(len(df))
        else:
            df = pd.read_sql_query("SELECT createddate, closeddate FROM %s" % self.table, con=engine)
            print(len(df))

        self.data = df

        df['createddate'] = df['createddate'].apply(lambda x: x.strftime('%m/%d/%Y %I:%M:%S %p'))

        return df.to_json(orient='index')

    def ttc_average_time(self):
        """
        Returns the average time in days or hours for a specific request type to be completed
        """
        df = self.data
        
       
        # pd.Timedelta.total_seconds(df['createddate'])
        print(df.dtypes)

        return df.to_json(orient='index', date_format='iso', date_unit='s')

if __name__ == "__main__":
    ttc = time_to_close()
    config = ConfigParser()
    config.read("../setting.cfg")
    ttc.config   = config
    ttc.dbString = config['Database']['DB_CONNECTION_STRING']
    ttc.ttc_view_table()
