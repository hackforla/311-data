from dataclasses import dataclass
import pandas as pd

@dataclass
class LoadCSV:
    fpath = ''

    def load(self):
        return pd.read_csv(self.fpath)

@dataclass
class AllYears311Data:

    years = [2015,2016,2017,2018]
    for year in years:


    MyLA311_Service_Request_Data_2016.csv
