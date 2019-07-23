import os
import pandas as pd
import numpy as np
import matplotlib
import matplotlib.pyplot as plt
from sodapy import Socrata


class BasicSodaClient(object):
    def __init__(self):
        matplotlib.use("TkAgg")
        # If you choose to use a token, run the following command on the terminal (or add it to your .bashrc)
        # $ export SODAPY_APPTOKEN=<token>
        self.socrata_token = os.environ.get("SODAPY_APPTOKEN")


    def get_socrata_df(self, domain, identifier):
        client = Socrata(domain, self.socrata_token)
        results = client.get(identifier)
        df = pd.DataFrame.from_dict(results)
        print(df.head())
        return df


    def compare_by_request(self, df_list, request_type, keys):
        aggregates = [x.requesttype.str.contains(request_type).value_counts() for x in df_list]
        request_type_related = pd.concat(aggregates, keys=keys, names=["Time", "Contains " + request_type], sort=True)
        request_type_related = request_type_related.div(request_type_related.sum()).round(2)
        request_type_related.plot(kind='barh', x="Time", y="Contains " + request_type)
        print(request_type_related)
        plt.show()


if __name__ == '__main__':
    soda_client = BasicSodaClient()
    comparisons = [ ('data.lacity.org', '2016', 'ndkd-k878'),
                    ('data.lacity.org', '2017', 'd4vt-q4t5')]
    keys = []
    frames = []
    for comparison in comparisons:
        domain, key, identifier = comparison
        df = soda_client.get_socrata_df(domain, identifier)
        keys.append(key)
        frames.append(df)

    soda_client.compare_by_request(frames, "Bulky Items", keys)
