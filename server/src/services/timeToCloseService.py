import pandas as pd
import numpy as np
from .dataService import DataService


class TimeToCloseService(object):
    def __init__(self, config=None, tableName="ingest_staging_table"):
        self.dataAccess = DataService(config, tableName)

    def ttc(self, groupField, groupFieldItems, filters):

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
        fields = [groupField, 'createddate', 'closeddate']
        data = self.dataAccess.query(fields, filters)

        # read into a dataframe and drop the nulls
        df = pd.DataFrame(data['data'], columns=fields).dropna()

        # generate a new dataframe that contains the number of days it
        # takes to close each request, plus the type of request
        df['closeddate'] = pd.to_datetime(df['closeddate'])
        df['createddate'] = pd.to_datetime(df['createddate'])
        df['time-to-close'] = df['closeddate'] - df['createddate']
        df['hours-to-close'] = df['time-to-close'].astype('timedelta64[h]')
        df['days-to-close'] = (df['hours-to-close'] / 24).round(2)
        dtc_df = df[[groupField, 'days-to-close']]

        # group the requests by type and get box plot stats for each type
        data['data'] = dtc_df \
            .groupby(by=groupField) \
            .apply(lambda df: get_boxplot_stats(df['days-to-close'].values)) \
            .to_dict()

        # if no rows exist for a particular item in the groupField,
        # return a count of 0
        for item in groupFieldItems:
            if item not in data['data'].keys():
                data['data'][item] = {'count': 0}

        return data

    async def get_ttc(self,
                      startDate=None,
                      endDate=None,
                      requestTypes=[],
                      ncList=[]):
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

        filters = self.dataAccess.standardFilters(
            startDate, endDate, requestTypes, ncList)

        return self.ttc('requesttype', requestTypes, filters)

    async def get_ttc_comparison(self,
                                 startDate=None,
                                 endDate=None,
                                 requestTypes=[],
                                 set1={'district': None, 'list': []},
                                 set2={'district': None, 'list': []}):

        """
        For each of the two sets, returns the statistics necessary to generate
        a boxplot of the number of days it took to close the requests.

        Example response:
        {
            lastPulled: Timestamp,
            data: {
                set1: {
                    district: 'nc',
                    data: {
                        'DOWNTOWN LOS ANGELES': { stats },
                        'ARLETA NC': { stats }
                        ...
                    }
                },
                set2: {
                    district: 'cc',
                    data: {
                        1: { stats },
                        15: { stats }
                        ...
                    }
                }
            }
        }
        """

        def get_data(district, items):
            common = {
                'startDate': startDate,
                'endDate': endDate,
                'requestTypes': requestTypes
            }

            if district == 'nc':
                common['ncList'] = items
                filters = self.dataAccess.comparisonFilters(**common)
                return self.ttc('ncname', items, filters)

            elif district == 'cc':
                common['cdList'] = items
                filters = self.dataAccess.comparisonFilters(**common)
                return self.ttc('cd', items, filters)

        set1data = get_data(set1['district'], set1['list'])
        set2data = get_data(set2['district'], set2['list'])

        return {
            'lastPulled': set1data['lastPulled'],
            'data': {
                'set1': {
                    'district': set1['district'],
                    'data': set1data['data']
                },
                'set2': {
                    'district': set2['district'],
                    'data': set2data['data']
                }
            }
        }
