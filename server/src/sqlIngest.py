from sqlalchemy.types import Integer, Text, String, DateTime, Float
from sqlalchemy import create_engine
import pandas as pd
from configparser import ConfigParser # For configparser compatible formatting see: https://docs.python.org/3/library/configparser.html
import numpy as np
import logging

class DataHandler:
    def __init__(self):
        self.data     = None
        self.config   = None
        self.dbString = None
        self.csvPath  = None
        self.configFilePath = None

    def loadConfig(self, configFilePath):
        '''Load and parse config data'''
        print('Loading config file %s' % self.configFilePath)
        self.configFilePath = configFilePath
        config = ConfigParser()
        config.read(configFilePath)
        self.config   = config
        self.dbString = config['Main']['DB_CONNECTION_STRING']
        self.csvPath  = "%s311data.tsv" % (config['Main']['CSV_DIRECTORY'])

    def loadData(self):
        '''Load dataset into pandas object'''
        print('Loading dataset %s' % self.csvPath)
        self.data = pd.read_table(self.csvPath,
                                    sep='\t',
                                    na_values=['nan'],
                                    dtype={
                                    'SRNumber':str,
                                    'CreatedDate':str,
                                    'UpdatedDate':str,
                                    'ActionTaken':str,
                                    'Owner':str,
                                    'RequestType':str,
                                    'Status':str,
                                    'RequestSource':str,
                                    'MobileOS':str,
                                    'Anonymous':str,
                                    'AssignTo':str,
                                    'ServiceDate':str,
                                    'ClosedDate':str,
                                    'AddressVerified':str,
                                    'ApproximateAddress':str,
                                    'Address':str,
                                    'HouseNumber':str,
                                    'Direction':str,
                                    'StreetName':str,
                                    'Suffix':str,
                                    'ZipCode':str,
                                    'Latitude':str,
                                    'Longitude':str,
                                    'Location':str,
                                    'TBMPage':str,
                                    'TBMColumn':str,
                                    'TBMRow':str,
                                    'APC':str,
                                    'CD':str,
                                    'CDMember':str,
                                    'NC':str,
                                    'NCName':str,
                                    'PolicePrecinct':str
                                    })

    def cleanData(self):
        '''Perform general data filtering'''
        print('Cleaning 311 dataset...')
        data = self.data
        zipIndex = (data['ZipCode'].str.isdigit()) | (data['ZipCode'].isna())
        data['ZipCode'].loc[~zipIndex] = np.nan
        # Format dates as datetime (Time intensive)
        data['CreatedDate'] = pd.to_datetime(data['CreatedDate'])
        data['ClosedDate'] = pd.to_datetime(data['ClosedDate'])
        data['ServiceDate'] = pd.to_datetime(data['ServiceDate'])
        # Compute service time
        # New columns: closed_created, service_created
        # xNOTE: SQLAlchemy/Postgres will convert these time deltas to integer values
        #        May wish to change these to a different format
        data['closed_created'] = data.ClosedDate-data.CreatedDate
        data['service_created'] = data.ServiceDate-data.CreatedDate
        # drop NA values and reformat closed_created in units of hours
        data = data[~data.closed_created.isna()]
        # New column: closed_created in units of days
        data['closed_createdD'] = data.closed_created / pd.Timedelta(days=1)
        # xFUTURE: Geolocation/time clustering to weed out repeat requests
        # xFUTURE: Decide whether ServiceDate or ClosedDate are primary metric
        # xFUTURE: Removal of feedback and other categories
        self.data = data

    def ingestData(self):
        '''Set up connection to database'''
        print('Inserting data into Postgres instance...')
        data = self.data
        engine = create_engine(self.dbString)
        newColumns = [column.replace(' ', '_').lower() for column in data]
        data.columns = newColumns
        # Ingest data
        data.to_sql("ingest_staging_table",
                       engine,
                       if_exists='replace',
                       schema='public',
                       index=False,
                       chunksize=10000,
                       dtype={'srnumber':String,
                       'createddate':DateTime,
                       'updateddate':DateTime,
                       'actiontaken':String,
                       'owner':String,
                       'requesttype':String,
                       'status':String,
                       'requestsource':String,
                       'createdbyuserorganization':String,
                       'mobileos':String,
                       'anonymous':String,
                       'assignto':String,
                       'servicedate':String,
                       'closeddate':String,
                       'addressverified':String,
                       'approximateaddress':String,
                       'address':String,
                       'housenumber':String,
                       'direction':String,
                       'streetname':String,
                       'suffix':String,
                       'zipcode':Integer,
                       'latitude':Float,
                       'longitude':Float,
                       'location':String,
                       'tbmpage':Integer,
                       'tbmcolumn':String,
                       'tbmrow':Float,
                       'apc':String,
                       'cd':Float,
                       'cdmember':String,
                       'nc':Float,
                       'ncname':String,
                       'policeprecinct':String,
                       'closedcreated':DateTime,
                       'servicecreated':DateTime,
                       'closedcreatedd':DateTime})

if __name__ == "__main__":
    loader = DataHandler()
    loader.loadConfig('settings.cfg')
    loader.loadData()
    loader.cleanData()
    loader.ingestData()
