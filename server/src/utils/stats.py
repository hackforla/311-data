"""
This is a collection of pure statistical functions that support
the visualizations and comparison endpoints.
"""

import pandas as pd
import numpy as np
import math


def box_plot(arr, C=1.5):
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

    # don't let whiskers be inside range q1 -> q3
    whiskerMin = min([q1, whiskerMin])
    whiskerMax = max([q3, whiskerMax])

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


def box_plots(df, plotField, groupField, groupFieldItems):
    """
    Returns a dictionary of box plot statistics for the plotField,
    where the keys are the unique items in the groupField.
    """
    # reduce df and drop the nulls
    df = df[[plotField, groupField]].dropna()

    # group the requests by type and get box plot stats for each type
    data = df \
        .groupby(by=groupField) \
        .apply(lambda df: box_plot(df[plotField].values)) \
        .to_dict()

    # if no rows exist for a particular item in the groupField,
    # return a count of 0
    for item in groupFieldItems:
        if item not in data.keys():
            data[item] = {'count': 0}

    return data


def date_bins(startDate, endDate):
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


def date_histogram(dates, bins):
    """ count the number of dates in each date bin """
    dates = dates.astype('datetime64[s]').astype('float')
    counts, _ = np.histogram(dates, bins=bins)
    return list(map(int, counts))


def date_histograms(df, dateField, bins, groupField, groupFieldItems):
    """
    Returns a dictionary of histograms, where the keys are the unique values
    in the groupField, and the values are the counts within the dateField.
    """
    # reduce df and drop the nulls
    df = df[[dateField, groupField]].dropna()

    # convert bins to float so numpy can use them
    bins_fl = np.array(bins).astype('datetime64[s]').astype('float')

    # count the requests created in each bin
    counts = df \
        .groupby(by=groupField) \
        .apply(lambda df: date_histogram(df[dateField].values, bins_fl)) \
        .to_dict()

    # if no rows exist for a particular item in the groupField,
    # return all 0's for that item
    for item in groupFieldItems:
        if item not in counts.keys():
            counts[item] = [0 for bin in bins][:-1]

    return counts


def counts(df, groupField):
    return df.groupby(by=groupField).size().to_dict()
