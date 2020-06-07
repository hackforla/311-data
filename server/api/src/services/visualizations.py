from . import requests
from .stats import box_plots, date_bins, date_histograms, counts


async def visualizations(startDate,
                         endDate,
                         requestTypes=[],
                         ncList=[]):

    bins, start, end = date_bins(startDate, endDate)

    fields = [
        'requesttype',
        'createddate',
        '_daystoclose',
        'requestsource']

    filters = {
        'startDate': start,
        'endDate': end,
        'requestTypes': requestTypes,
        'ncList': ncList}

    df = requests.standard_query(fields, filters, table='vis')

    inner_df = df.loc[
        (df['createddate'] >= startDate) &
        (df['createddate'] <= endDate)]

    return {
        'frequency': {
            'bins': list(bins.astype(str)),
            'counts': date_histograms(
                df,
                dateField='createddate',
                bins=bins,
                groupField='requesttype',
                groupFieldItems=requestTypes)},

        'timeToClose': box_plots(
            inner_df,
            plotField='_daystoclose',
            groupField='requesttype',
            groupFieldItems=requestTypes),

        'counts': {
            'type': counts(inner_df, groupField='requesttype'),
            'source': counts(inner_df, groupField='requestsource')}
    }
