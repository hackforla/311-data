from .dataService import DataService
from utils.stats import box_plots, date_bins, date_histograms, counts


class ComparisonService(object):
    def __init__(self):
        self.dataAccess = DataService()

    def frequency_comparison(self,
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
                groupField = 'nc'
            elif district == 'cc':
                common['cdList'] = items
                groupField = 'cd'

            fields = [groupField, 'createddate']
            filters = self.dataAccess.comparisonFilters(**common)
            df = self.dataAccess.query(fields, filters, table='vis')

            return date_histograms(
                df,
                dateField='createddate',
                bins=bins,
                groupField=groupField,
                groupFieldItems=items)

        bins, start, end = date_bins(startDate, endDate)
        set1data = get_data(set1['district'], set1['list'], bins, start, end)
        set2data = get_data(set2['district'], set2['list'], bins, start, end)

        return {
            'bins': list(bins.astype(str)),
            'set1': {
                'district': set1['district'],
                'counts': set1data
            },
            'set2': {
                'district': set2['district'],
                'counts': set2data
            }
        }

    def ttc_comparison(self,
                       startDate=None,
                       endDate=None,
                       requestTypes=[],
                       set1={'district': None, 'list': []},
                       set2={'district': None, 'list': []}):

        def get_data(district, items):
            common = {
                'startDate': startDate,
                'endDate': endDate,
                'requestTypes': requestTypes
            }

            if district == 'nc':
                common['ncList'] = items
                groupField = 'nc'
            elif district == 'cc':
                common['cdList'] = items
                groupField = 'cd'

            fields = [groupField, '_daystoclose']
            filters = self.dataAccess.comparisonFilters(**common)
            df = self.dataAccess.query(fields, filters, table='vis')

            return box_plots(
                df,
                plotField='_daystoclose',
                groupField=groupField,
                groupFieldItems=items)

        set1data = get_data(set1['district'], set1['list'])
        set2data = get_data(set2['district'], set2['list'])

        return {
            'set1': {
                'district': set1['district'],
                'data': set1data
            },
            'set2': {
                'district': set2['district'],
                'data': set2data
            }
        }

    def counts_comparison(self,
                          startDate=None,
                          endDate=None,
                          requestTypes=[],
                          set1={'district': None, 'list': []},
                          set2={'district': None, 'list': []}):

        def get_data(district, items):
            common = {
                'startDate': startDate,
                'endDate': endDate,
                'requestTypes': requestTypes
            }

            if district == 'nc':
                common['ncList'] = items
            elif district == 'cc':
                common['cdList'] = items

            fields = ['requestsource']
            filters = self.dataAccess.comparisonFilters(**common)
            df = self.dataAccess.query(fields, filters, table='vis')

            return counts(df, 'requestsource')

        set1data = get_data(set1['district'], set1['list'])
        set2data = get_data(set2['district'], set2['list'])

        return {
            'set1': {
                'district': set1['district'],
                'source': set1data
            },
            'set2': {
                'district': set2['district'],
                'source': set2data
            }
        }

    async def comparison(self,
                         type=None,
                         startDate=None,
                         endDate=None,
                         requestTypes=[],
                         set1={'district': None, 'list': []},
                         set2={'district': None, 'list': []}):

        args = {
            'startDate': startDate,
            'endDate': endDate,
            'requestTypes': requestTypes,
            'set1': set1,
            'set2': set2}

        if type == 'frequency':
            return self.frequency_comparison(**args)
        elif type == 'timetoclose':
            return self.ttc_comparison(**args)
        elif type == 'counts':
            return self.counts_comparison(**args)
        else:
            return {'Error': 'Unrecognized comparison type'}
