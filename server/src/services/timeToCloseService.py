import pandas as pd
import numpy as np
from .dataService import DataService


class TimeToCloseService(object):
    def __init__(self, config=None, tableName="ingest_staging_table"):
        self.dataAccess = DataService(config, tableName)

    async def get_ttc(self,
                      startDate=None,
                      endDate=None,
                      ncList=[],
                      requestTypes=[]):
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
                'count': len(arr),
                'outlierCount': len(outliers)
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
