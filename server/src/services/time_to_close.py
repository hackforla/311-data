from configparser import ConfigParser
import sqlalchemy as db
import pandas as pd
from datetime import datetime as dt
import numpy as np
import json


class time_to_close(object):
    def __init__(self, config=None, requestTypes=None, tableName="ingest_staging_table"):
        """
        Choose table from database by setting the value of tableName. Default table is the staging table.
        """
        self.config = config
        self.dbString = None if not self.config else self.config['Database']['DB_CONNECTION_STRING']
        self.table = tableName
        self.data = None
        pass

    def ttc_view_data(self, onlyClosed=False):
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
            df = pd.read_sql_query(
                "SELECT * FROM %s WHERE Status = 'Closed'" % self.table, con=engine)
        else:
            df = pd.read_sql_query("SELECT * FROM %s" % self.table, con=engine)

        return df.to_json(orient='index')

    def ttc_view_dates(self, serviced=False):
        """
        Returns all rows under the CreatedDate and ClosedDate columns in human-readable format
        Returns all rows with a service date under CreatedDate, ClosedDate, and ServicedDate columns if serviced is True
        """
        engine = db.create_engine(self.dbString)

        if serviced:
            df = pd.read_sql_query(
                "SELECT createddate, closeddate, servicedate FROM %s" % self.table, con=engine)
            df = df[df['servicedate'].notnull()]
        else:
            df = pd.read_sql_query(
                "SELECT createddate, closeddate FROM %s" % self.table, con=engine)

        df['createddate'] = df['createddate'].apply(
            lambda x: x.strftime('%m/%d/%Y %I:%M:%S %p'))

        return df.to_json(orient='index')

    def ttc_to_days(self, dt):
        """
        Converts Unix time to days
        """
        num_days = pd.Timedelta.total_seconds(dt)/(24.*3600)
        if num_days <= .000001:
            return 0

        in_days = pd.Timedelta.total_seconds(dt)/(24.*3600)
        return in_days

    def ttc_days_to_string(self, day):
        return str(day) + " Days"

    def ttc_time_diff(self, alldata, serviced, allRequests, requestType):
        """
        Sets self.data to a dataframe catalogging the time it takes a request to close
        Parameters are inherited from ttc_summary()
        """

        engine = db.create_engine(self.dbString)

        if serviced:
            if not allRequests:
                query = "SELECT createddate, closeddate, servicedate FROM %s WHERE requesttype=%s" % (
                    self.table, requestType)
                print(query)
                df = pd.read_sql_query(
                    query, con=engine)
            else:
                df = pd.read_sql_query(
                    "SELECT createddate, closeddate, servicedate FROM %s" % self.table, con=engine)
            df = df[df['servicedate'].notnull()]
            df['servicedate'] = pd.to_datetime(df['servicedate'])
            diff_df = pd.DataFrame(
                df['servicedate'] - df['createddate'], columns=['time_to_service'])

        else:
            if not allRequests:
                df = pd.read_sql_query(
                    "SELECT createddate, closeddate FROM %s WHERE requesttype=%s" % (self.table, requestType), con=engine)
            else:
                df = pd.read_sql_query(
                    "SELECT createddate, closeddate FROM %s" % self.table, con=engine)
            diff_df = pd.DataFrame({'time_to_close': []})

        df['createddate'] = pd.to_datetime(df['createddate'])
        df['closeddate'] = pd.to_datetime(df['closeddate'])
        diff_df['time_to_close'] = df['closeddate'] - df['createddate']
        diff_df = diff_df[diff_df['time_to_close'].notnull()]

        for column in diff_df:
            diff_df[column] = diff_df[column].apply(self.ttc_to_days)

        self.data = diff_df

    def ttc_summary(self, allData=False, serviced=False, allRequests=True, requestType=""):
        """
        Returns summary data of the amount of time it takes for a request to close as a dataframe
        If serviced is set to True, returns summary data of time_to_service as well
        If allData is set to True, returns the data of every entry as well
        If allRequests are set to False, queries data of the value of requestType only
        """
        self.ttc_time_diff(allData, serviced, allRequests, requestType)
        data = self.data

        summary_arr = []

        for column in data:
            summary = data[column].describe()
            df_desc = pd.DataFrame({column: summary})
            df_json = json.loads(df_desc.to_json())
            summary_arr.append(df_json)

        if allData:
            days_df = data.copy()

            for column in days_df:
                days_df[column] = days_df[column].apply(
                    self.ttc_days_to_string)

            days_df_json = json.loads(days_df.to_json())
            summary_arr.append(days_df_json)

        return summary_arr

    # Todo: Change service/closed summary dfs into columns
    # Todo: Stringify summary
    # Todo: Change the meaning of service
    # Todo: Add view_dates to summary option
    # Todo: RequestType to self?
    # Todo: Implement functionality for only open status data?

if __name__ == "__main__":
    ttc = time_to_close()
    config = ConfigParser()
    config.read("../setting.cfg")
    ttc.config = config
    ttc.dbString = config['Database']['DB_CONNECTION_STRING']
    ttc.ttc_view_data()
    ttc.ttc_summary()
