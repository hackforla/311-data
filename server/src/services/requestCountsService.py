from .dataService import DataService


class RequestCountsService(object):
    def __init__(self, config=None):
        self.dataAccess = DataService()

    async def get_req_counts(self,
                             startDate=None,
                             endDate=None,
                             requestTypes=[],
                             ncList=[],
                             countFields=[]):
        """
        For each countField, returns the counts of each distinct value
        in that field, given times, ncs, and request filters.
        E.g. if countsFields is ['requesttype', 'requestsource'], returns:
        [
            {
                'field': 'requesttype',
                'counts': {
                    'Graffiti Removal': 'Int',
                    'Bulky Items': 'Int',
                    ...
                }
            },
            {
                'field': 'requestsource',
                'counts': {
                    'Mobile App': 'Int',
                    'Driver Self Report': 'Int',
                    ...
                }
            }
        ]
        """

        filters = self.dataAccess.standardFilters(
            startDate, endDate, requestTypes, ncList)

        return self.dataAccess.aggregateQuery(countFields, filters)

    async def get_req_counts_comparison(self,
                                        startDate=None,
                                        endDate=None,
                                        requestTypes=[],
                                        set1={'district': None, 'list': []},
                                        set2={'district': None, 'list': []},
                                        countFields=[]):

        """
        {
            "set1": {
                "district": "nc",
                "data": [
                    {
                        "field": "requestsource",
                        "counts": {
                            "Call": 48,
                            "Driver Self Report": 68,
                            "Mobile App": 41,
                            "Self Service": 41
                        }
                    },
                    {
                        "field": "requesttype",
                        "counts": {
                            "Bulky Items": 93,
                            "Graffiti Removal": 105
                        }
                    }
                ]
            },
            "set2": {
                "district": "cc",
                "data": [
                    {
                        "field": "requestsource",
                        "counts": {
                            "Call": 572,
                            "Driver Self Report": 279,
                            "Email": 2,
                            "Mobile App": 530,
                            "Self Service": 159
                        }
                    },
                    {
                        "field": "requesttype",
                        "counts": {
                            "Bulky Items": 1053,
                            "Graffiti Removal": 489
                        }
                    }
                ]
            }
        }
        """

        def get_filters(district, items):
            common = {
                'startDate': startDate,
                'endDate': endDate,
                'requestTypes': requestTypes
            }

            if district == 'nc':
                common['ncList'] = items
                return self.dataAccess.comparisonFilters(**common)

            elif district == 'cc':
                common['cdList'] = items
                return self.dataAccess.comparisonFilters(**common)

        filters = get_filters(set1['district'], set1['list'])
        set1data = self.dataAccess.aggregateQuery(countFields, filters)

        filters = get_filters(set2['district'], set2['list'])
        set2data = self.dataAccess.aggregateQuery(countFields, filters)

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
