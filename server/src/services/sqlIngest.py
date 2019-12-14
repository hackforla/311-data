import os
from sqlalchemy.types import Integer, Text, String, DateTime, Float
from sqlalchemy import create_engine
import pandas as pd
from configparser import ConfigParser # For configparser compatible formatting see: https://docs.python.org/3/library/configparser.html
import numpy as np
import logging
import io

class DataHandler:
    def __init__(self, config=None, configFilePath=None, separator=','):
        self.data     = None
        self.config   = config
        self.dbString = None if not self.config else self.config['Database']['DB_CONNECTION_STRING']
        self.filePath  = None
        self.configFilePath = configFilePath
        self.separator = separator


    def loadConfig(self, configFilePath):
        '''Load and parse config data'''
        if self.config:
            print('Config already exists at %s. Nothing to load.' % self.configFilePath)
            return

        print('Loading config file %s' % configFilePath)
        self.configFilePath = configFilePath
        config = ConfigParser()
        config.read(configFilePath)
        self.config   = config
        self.dbString = config['Database']['DB_CONNECTION_STRING']


    def loadData(self, fileName="311data"):
        '''Load dataset into pandas object'''
        if self.separator == ',':
            dataFile = fileName + ".csv"
        else:
            dataFile = fileName + ".tsv"

        self.filePath  = os.path.join(self.config['Database']['DATA_DIRECTORY'], dataFile )
        print('Loading dataset %s' % self.filePath)
        self.data = pd.read_table(self.filePath,
                                    sep=self.separator,
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
        # New columns: closed_created, service_created
        # xNOTE: SQLAlchemy/Postgres will convert these time deltas to integer values
        #        May wish to change these to a different format or compute after fact
        # data['closed_created'] = data.ClosedDate-data.CreatedDate
        # data['service_created'] = data.ServiceDate-data.CreatedDate
        # drop NA values and reformat closed_created in units of hours
        # data = data[~data.closed_created.isna()]
        # New column: closed_created in units of days
        # data['closed_createdD'] = data.closed_created / pd.Timedelta(days=1)
        # xFUTURE: Geolocation/time clustering to weed out repeat requests
        # xFUTURE: Decide whether ServiceDate or ClosedDate are primary metric
        # xFUTURE: Removal of feedback and other categories
        self.data = data

    def ingestData(self):
        '''Set up connection to database'''
        print('Inserting data into Postgres instance...')
        data = self.data.copy() # shard deepcopy to allow other endpoint operations
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
                       'policeprecinct':String})

    def dumpCsvFile(self, dataset, startDate, requestType, councilName):
        '''Output data as CSV by council name, requset type, and
        start date (pulls to current date). Arguments should be passed
        as strings. Date values must be formatted %Y-%m-%d.'''
        df = dataset.copy() # Shard deepcopy to allow multiple endpoints
        # Data filtering
        dateFilter = df['CreatedDate'] > startDate
        requestFilter = df['RequestType'] == requestType
        councilFilter = df['NCName'] == councilName
        df = df[dateFilter & requestFilter & councilFilter]
        # Return string object for routing to download
        return df.to_csv()


if __name__ == "__main__":
    '''Class DataHandler workflow from initial load to SQL population'''
    loader = DataHandler()
    loader.loadConfig(configFilePath='../settings.cfg')
    loader.loadData()
    loader.cleanData()
    loader.ingestData()
    loader.dumpCsvFile(startDate='2018-05-01', requestType='Bulky Items', councilName='VOICES OF 90037')
