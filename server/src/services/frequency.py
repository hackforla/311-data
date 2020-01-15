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

    def freq_view_all(self, serviced=False, aggregate=True):
        """
        Returns the request type and associated dates for all data
        Sorted by request type, followed by created date, service date (if applicable), and then closed date
        """
        # Todo: implement condition for serviced date
        engine = db.create_engine(self.dbString)

        if serviced:
            query = "SELECT requesttype, createddate, closeddate, servicedate FROM %s" % self.table
        else:
            query = "SELECT requesttype, createddate, closeddate FROM %s" % self.table

        df = pd.read_sql_query(query, con=engine)

        if serviced:
            df['servicedate'] = pd.to_datetime(df['servicedate'])

        df['closeddate'] = pd.to_datetime(df['closeddate'])
        df = df.sort_values(by=['requesttype', 'createddate', 'closeddate'])

        return df.to_json(orient="records")

    def freq_aggregate(self):
        engine = db.create_engine(self.dbString)
        
        query = "SELECT requesttype FROM %s" % (self.table)
        df = pd.read_sql_query(query, con=engine)

        request_counts = df['requesttype'].value_counts()
        
        return request_counts.to_json()

    def freq_view_data(self, service=False, aggregate=True, startdate="", enddate=""):
        """
        Returns the request type and the created and closed dates for all data
        Sorted by request type, followed by created date, and then closed date
        Returns serviced date as well if service is set to True
        Returns summary data as well if aggregate is set to True
        Returns only entries created between startdate and enddate if values are set for those parameters
        Format of startdate and enddate should be a string in the form 2019-12-01 23:02:05
        """
        engine = db.create_engine(self.dbString)

        if service:
            df = pd.read_sql_query("SELECT requesttype, createddate, closeddate, servicedate FROM %s" % self.table, con=engine)
            df['servicedate'] = pd.to_datetime(df['servicedate'])

        else:
            df = pd.read_sql_query("SELECT requesttype, createddate, closeddate FROM %s" % self.table, con=engine)

        df['closeddate'] = pd.to_datetime(df['closeddate'])
        
        if startdate != "":
            start = pd.to_datetime(startdate)
            df = df[(df['createddate'] >= start)]

        if enddate != "":
            end = pd.to_datetime(enddate)
            df = df[df['createddate'] <= end]

        df = df.sort_values(by=['requesttype', 'createddate', 'closeddate'])
        df_json = json.loads(df.to_json(orient="records"))

        if aggregate:
            summary = self.freq_aggregate()
            json_data = []
            json_data.append(json.loads(summary))
            json_data.append(df_json)
            return json_data

        return df_json

    # Todo: filter by date

if __name__ == "__main__":
    freq = frequency()
    config = ConfigParser()
    config.read("../setting.cfg")
    freq.config = config
    freq.dbString = config['Database']['DB_CONNECTION_STRING']
    freq.freq_view_data()
