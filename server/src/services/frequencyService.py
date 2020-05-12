import pandas as pd
import numpy as np
import math
from .dataService import DataService


class FrequencyService(object):
    def __init__(self, config=None):
        self.dataAccess = DataService()

    def get_bins(self, startDate, endDate):
        """
        Takes a date range a returns a list of equal-size date bins that
        cover the range.

        For ranges of 24 days or less, each bin covers one calendar day.

        For larger ranges, each bin is the largest size such that:
        (1) the size is a whole number of days (i.e. the bin edges
        are all at midnight)
        (2) the number of bins is at least 12.

        Not all date ranges are evenly divisible by a whole number of
        days, so in cases where they aren't, we move the end date forward
        so that the last bin is the same size as the rest.
        """
        start = pd.to_datetime(startDate)
        end = pd.to_datetime(endDate) + pd.Timedelta(days=1)
        diff = (end - start).days

        # calculate size and number of bins
        bin_size = 1 if diff <= 24 else diff // 12
        num_bins = math.ceil(diff / bin_size)

        # move the end date forward in cases where the range can't
        # be evenly divided
        if diff != num_bins * bin_size:
            end = start + num_bins * pd.Timedelta(days=bin_size)

        bins = pd.date_range(start, end, freq='{}D'.format(bin_size))
        return bins, start, end

    def frequency(self, groupField, groupFieldItems, bins, filters):
        def get_counts(dates, bins):
            """ count the number of dates in each date bin """
            dates = dates.astype('datetime64[s]').astype('float')
            counts, _ = np.histogram(dates, bins=bins)
            return list(map(int, counts))

        # grab the necessary data from the db and drop nulls
        fields = [groupField, 'createddate']
        df = self.dataAccess.query(fields, filters, table='vis').dropna()

        # convert bins to float so numpy can use them
        bins_fl = np.array(bins).astype('datetime64[s]').astype('float')

        # count the requests created in each bin
        counts = df \
            .groupby(by=groupField) \
            .apply(lambda x: get_counts(x['createddate'].values, bins_fl)) \
            .to_dict()

        # if no rows exist for a particular item in the groupField,
        # return all 0's for that item
        for item in groupFieldItems:
            if item not in counts.keys():
                counts[item] = [0 for bin in bins][:-1]

        return {
            'bins': list(bins.astype(str)),
            'counts': counts
        }

    async def get_frequency(self,
                            startDate=None,
                            endDate=None,
                            requestTypes=[],
                            ncList=[]):

        """
        Given a date range, covers the range with equal-length date bins, and
        counts the number of requests that were created in each date bin.

        Example response if startDate = 01/01/18 and endDate = 03/02/2020
        {
            'bins': [
                "2018-01-01",
                "2018-03-08",
                "2018-05-13",
                "2018-07-18",
                "2018-09-22",
                "2018-11-27",
                "2019-02-01",
                "2019-04-08",
                "2019-06-13",
                "2019-08-18",
                "2019-10-23",
                "2019-12-28",
                "2020-03-03"
            ],
            'counts': {
                'Graffiti Removal': [
                    125, 15, 53, 24, 98, 42,
                    33, 128, 30, 16, 138, 57
                ],
                'Bulky Items': [
                    1, 1, 2, 3, 5, 8,
                    13, 21, 34, 55, 89, 144
                ]
            }
        }

        Note that the number of bins is one greater than the number of counts,
        because the list of bins includes the end date of the final bin.
        """

        bins, start, end = self.get_bins(startDate, endDate)

        filters = self.dataAccess.standardFilters(
            start, end, requestTypes, ncList)

        return self.frequency('requesttype', requestTypes, bins, filters)

    async def get_frequency_comparison(self,
                                       startDate=None,
                                       endDate=None,
                                       requestTypes=[],
                                       set1={'district': None, 'list': []},
                                       set2={'district': None, 'list': []}):

        def get_data(district, items, bins, start, end):
            common = {
                'startDate': start,
                'endDate': end,
                'requestTypes': requestTypes
            }

            if district == 'nc':
                common['ncList'] = items
                filters = self.dataAccess.comparisonFilters(**common)
                return self.frequency('nc', items, bins, filters)

            elif district == 'cc':
                common['cdList'] = items
                filters = self.dataAccess.comparisonFilters(**common)
                return self.frequency('cd', items, bins, filters)

        bins, start, end = self.get_bins(startDate, endDate)

        set1data = get_data(set1['district'], set1['list'], bins, start, end)
        set2data = get_data(set2['district'], set2['list'], bins, start, end)

        return {
            'bins': set1data['bins'],
            'set1': {
                'district': set1['district'],
                'counts': set1data['counts']
            },
            'set2': {
                'district': set2['district'],
                'counts': set2data['counts']
            }
        }
