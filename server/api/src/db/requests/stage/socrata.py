"""
This is a simple wrapper for Socrata that handles a couple of issues:
1. retrying requests in the event of a timeout or other failure
2. grabbing the dataset id from the config based on the year
3. automatically closing the client when we're done using it

Usage is like this:
    socrata = SocrataClient()
    results = socrata.get(year, **kwargs)

kwargs are all of the normal socrata kwargs - select, limit, etc.
"""

from sodapy import Socrata
from settings import Socrata as conf


class SocrataClient:
    def __init__(self):
        self.client = Socrata(conf.DOMAIN, conf.TOKEN, timeout=conf.TIMEOUT)

    def __del__(self):
        self.client.close()

    def dataset_id(self, year):
        return conf.DATASET_IDS[year]

    def get(self, year, **kwargs):
        id = self.dataset_id(year)
        for attempt in range(conf.ATTEMPTS):
            try:
                return self.client.get(id, **kwargs)
            except Exception as e:
                if attempt < conf.ATTEMPTS - 1:
                    continue
                else:
                    raise e

    def get_metadata(self, year):
        id = self.dataset_id(year)
        return self.client.get_metadata(id)

    def get_datasets(self):
        '''
        Search for "MyLA311 Service Request Data" within the response
        to get the dataset ids for each year.
        '''
        return self.client.datasets()
