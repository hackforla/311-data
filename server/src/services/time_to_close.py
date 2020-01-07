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

        # df = pd.read_sql_query("SELECT * FROM %s" % self.table, con=engine)

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
        num_days = pd.Timedelta.total_seconds(dt)/(24.*3600)
        if num_days <= .000001:
            return 0

        in_days = pd.Timedelta.total_seconds(dt)/(24.*3600)
        return in_days

    def ttc_days_to_string(self, day):
        return str(day) + " Days"

    def ttc_time_diff(self, serviced=False, allRequests=True, requestType=""):
        """
        Returns the amount of time for a request to close in days
        If serviced is set to True, only requests that have been serviced are included
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

        diff_df_str = diff_df.copy()

        for column in diff_df_str:
            diff_df_str[column] = diff_df_str[column].apply(
                self.ttc_days_to_string)

        self.data = diff_df
        return diff_df_str.to_json(orient='index')

    def ttc_summary(self):
        data = self.data

        summary_obj = {}

        for column in data:
            summary = data[column].describe()
            summary_obj.update({column: summary.to_json()})

        return json.dumps(summary_obj)

    # Todo: Implement functionality for only open status data


if __name__ == "__main__":
    ttc = time_to_close()
    config = ConfigParser()
    config.read("../setting.cfg")
    ttc.config = config
    ttc.dbString = config['Database']['DB_CONNECTION_STRING']
    ttc.ttc_view_data()
