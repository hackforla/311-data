from configparser import ConfigParser
import sqlalchemy as db
import pandas as pd
import json
from .dataService import DataService
import numpy as np


class time_to_close(object):
    def __init__(self,
                 config=None,
                 requestTypes=None,
                 tableName="ingest_staging_table"):
        """
        Choose table from database by setting the value of tableName.
        Default table is the staging table.
        """
        self.config = config
        self.dbString = None if not self.config\
            else self.config['Database']['DB_CONNECTION_STRING']
        self.table = tableName
        self.data = None
        self.dataAccess = DataService(config, tableName)
        pass

    def ttc(self, startDate=None, endDate=None, ncList=[], requestTypes=[]):
        """
        For each requestType, returns the statistics necessary to generate
        a boxplot of the number of days it took to close the requests.

        Example response:
        {
            lastPulled: Timestamp,
            data: {
                'Bulky Items': {
                    'min': float,
                    'q1': float,
                    'median': float,
                    'q3': float,
                    'max': float,
                    'whiskerMin': float,
                    'whiskerMax': float,
                    'outliers': [float],
                    'count': int
                }
                ...
            }
        }
        """

        def get_boxplot_stats(arr, C=1.5):
            """
            Takes a one-dimensional numpy array of floats and generates boxplot
            statistics for the data. The basic algorithm is standard.
            See https://en.wikipedia.org/wiki/Box_plot

            The max length of the whiskers is the constant C, multiplied by the
            interquartile range. This is a common method, although there
            are others. The default value of C=1.5 is typical when this
            method is used.
            See matplotlib.org/3.1.3/api/_as_gen/matplotlib.pyplot.boxplot.html
            """

            # calculate first and third quantiles
            q1 = np.quantile(arr, 0.25)
            q3 = np.quantile(arr, 0.75)

            # calculate whiskers
            iqr = q3 - q1
            whiskerMin = arr[arr >= q1 - C * iqr].min()
            whiskerMax = arr[arr <= q3 + C * iqr].max()

            # calculate outliers
            minOutliers = arr[arr < whiskerMin]
            maxOutliers = arr[arr > whiskerMax]
            outliers = list(np.concatenate((minOutliers, maxOutliers)))

            return {
                'min': np.min(arr),
                'q1': q1,
                'median': np.median(arr),
                'q3': q3,
                'max': np.max(arr),
                'whiskerMin': whiskerMin,
                'whiskerMax': whiskerMax,
                'outliers': outliers,
                'count': len(arr)
            }

        # grab the necessary data from the db
        fields = ['requesttype', 'createddate', 'closeddate']
        filters = self.dataAccess.standardFilters(
            startDate, endDate, ncList, requestTypes)
        data = self.dataAccess.query(fields, filters)

        # read into a dataframe, drop the nulls, and halt if no rows exist
        df = pd.DataFrame(data['data']).dropna()
        if len(df) == 0:
            data['data'] = {}
            return data

        # generate a new dataframe that contains the number of days it
        # takes to close each request, plus the type of request
        df['closeddate'] = pd.to_datetime(df['closeddate'])
        df['createddate'] = pd.to_datetime(df['createddate'])
        df['time-to-close'] = df['closeddate'] - df['createddate']
        df['hours-to-close'] = df['time-to-close'].astype('timedelta64[h]')
        df['days-to-close'] = (df['hours-to-close'] / 24).round(2)
        dtc_df = df[['requesttype', 'days-to-close']]

        # group the requests by type and get box plot stats for each type
        data['data'] = dtc_df \
            .groupby(by='requesttype') \
            .apply(lambda df: get_boxplot_stats(df['days-to-close'].values)) \
            .to_dict()

        return data

    def ttc_view_dates(self, service=False):
        """
        Returns all rows under the CreatedDate and
            ClosedDate columns in human-readable format
        Returns all rows with a service date under
            CreatedDate, ClosedDate, and ServicedDate columns
            if serviced is True
        """
        engine = db.create_engine(self.dbString)

        if service:
            df = pd.read_sql_query(
                "SELECT \
                createddate,\
                closeddate,\
                servicedate\
                FROM %s" % self.table, con=engine)
            df = df[df['servicedate'].notnull()]
        else:
            df = pd.read_sql_query(
                "SELECT \
                createddate,\
                closeddate\
                FROM %s" % self.table, con=engine)

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

    def ttc_time_diff(self, alldata, service, allRequests, requestType):
        """
        Sets self.data to a dataframe catalogging the time
            it takes a request to close
        Parameters are inherited from ttc_summary()
        """

        engine = db.create_engine(self.dbString)

        if service:
            if not allRequests:
                query = "SELECT \
                        createddate,\
                        closeddate,\
                        servicedate\
                        FROM %s WHERE requesttype=%s" %\
                        (self.table, requestType)
                print(query)
                df = pd.read_sql_query(
                    query, con=engine)
            else:
                df = pd.read_sql_query(
                    "SELECT \
                    createddate,\
                    closeddate,\
                    servicedate\
                    FROM %s" %
                    self.table, con=engine)
            df = df[df['servicedate'].notnull()]
            df['servicedate'] = pd.to_datetime(df['servicedate'])
            diff_df = pd.DataFrame(
                df['servicedate'] - df['createddate'],
                columns=['time_to_service'])

        else:
            if not allRequests:
                df = pd.read_sql_query(
                    "SELECT \
                    createddate,\
                    closeddate\
                    FROM %s WHERE requesttype=%s" %
                    (self.table, requestType), con=engine)
            else:
                df = pd.read_sql_query(
                    "SELECT \
                    createddate,\
                    closeddate\
                    FROM %s" %
                    self.table, con=engine)
            diff_df = pd.DataFrame({'time_to_close': []})

        df['createddate'] = pd.to_datetime(df['createddate'])
        df['closeddate'] = pd.to_datetime(df['closeddate'])
        diff_df['time_to_close'] = df['closeddate'] - df['createddate']
        diff_df = diff_df[diff_df['time_to_close'].notnull()]

        for column in diff_df:
            diff_df[column] = diff_df[column].apply(self.ttc_to_days)

        self.data = diff_df

    def ttc_summary(self,
                    allData=False,
                    service=False,
                    allRequests=True,
                    requestType="",
                    viewDates=False):
        """
        Returns summary data of the amount of time it takes for a
            request to close as a dataframe.
        If service is set to True, returns summary data of time_to_service
        as well
        If allData is set to True, returns the data of every entry as well
        If allRequests are set to False, queries data of
        the value of requestType only
        """
        self.ttc_time_diff(allData, service, allRequests, requestType)
        data = self.data
        print(data)

        summary_arr = []

        for column in data:
            summary = data[column].describe()
            df_desc = pd.DataFrame({column: summary})
            df_json = json.loads(df_desc.to_json())
            summary_arr.append(df_json)

        if not allData and not viewDates:
            return summary_arr

        data_arr = []
        data_arr.append(summary_arr)

        if allData:
            days_df = data.copy()
            days_df_json = json.loads(days_df.to_json())
            data_arr.append(days_df_json)

        if viewDates:
            dates = self.ttc_view_dates(service)
            data_arr.append(json.loads(dates))

        return data_arr

    # Todo: Implement functionality for only open status data?
    # Todo: Implement option to filter by NC?


if __name__ == "__main__":
    ttc = time_to_close()
    config = ConfigParser()
    config.read("../setting.cfg")
    ttc.config = config
    ttc.dbString = config['Database']['DB_CONNECTION_STRING']
    ttc.ttc_summary()
