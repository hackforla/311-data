import os
from sqlalchemy.types import Integer, String, DateTime, Float
import sqlalchemy as db
import pandas as pd
from configparser import ConfigParser
import numpy as np
from sodapy import Socrata
import time


class DataHandler:
    def __init__(self, config=None, configFilePath=None, separator=','):
        self.data = None
        self.config = config
        self.dbString = None if not self.config \
            else self.config['Database']['DB_CONNECTION_STRING']
        self.filePath = None
        self.configFilePath = configFilePath
        self.separator = separator
        self.fields = ['srnumber', 'createddate', 'updateddate', 'actiontaken',
                       'owner', 'requesttype', 'status', 'requestsource',
                       'createdbyuserorganization', 'mobileos', 'anonymous',
                       'assignto', 'servicedate', 'closeddate',
                       'addressverified', 'approximateaddress', 'address',
                       'housenumber', 'direction', 'streetname', 'suffix',
                       'zipcode', 'latitude', 'longitude', 'location',
                       'tbmpage', 'tbmcolumn', 'tbmrow', 'apc', 'cd',
                       'cdmember', 'nc', 'ncname', 'policeprecinct']

    def loadConfig(self, configFilePath):
        '''Load and parse config data'''
        if self.config:
            print('Config already exists at %s. Nothing to load.' %
                  self.configFilePath)
            return

        print('Loading config file %s' % configFilePath)
        self.configFilePath = configFilePath
        config = ConfigParser()
        config.read(configFilePath)
        self.config = config
        self.dbString = config['Database']['DB_CONNECTION_STRING']
        self.token = None if config['Socrata']['TOKEN'] == 'None' \
            else config['Socrata']['TOKEN']

    def loadData(self, fileName="2018_mini"):
        '''Load dataset into pandas object'''
        if self.separator == ',':
            dataFile = fileName + ".csv"
        else:
            dataFile = fileName + ".tsv"

        self.filePath = os.path.join(self.config['Database']['DATA_DIRECTORY'],
                                     dataFile)

        print('Loading dataset %s' % self.filePath)
        self.data = pd.read_table(self.filePath,
                                  sep=self.separator,
                                  na_values=['nan'],
                                  dtype={
                                    'SRNumber': str,
                                    'CreatedDate': str,
                                    'UpdatedDate': str,
                                    'ActionTaken': str,
                                    'Owner': str,
                                    'RequestType': str,
                                    'Status': str,
                                    'RequestSource': str,
                                    'MobileOS': str,
                                    'Anonymous': str,
                                    'AssignTo': str,
                                    'ServiceDate': str,
                                    'ClosedDate': str,
                                    'AddressVerified': str,
                                    'ApproximateAddress': str,
                                    'Address': str,
                                    'HouseNumber': str,
                                    'Direction': str,
                                    'StreetName': str,
                                    'Suffix': str,
                                    'ZipCode': str,
                                    'Latitude': str,
                                    'Longitude': str,
                                    'Location': str,
                                    'TBMPage': str,
                                    'TBMColumn': str,
                                    'TBMRow': str,
                                    'APC': str,
                                    'CD': str,
                                    'CDMember': str,
                                    'NC': str,
                                    'NCName': str,
                                    'PolicePrecinct': str
                                  })

    def elapsedTimer(self, timeVal):
        '''Simple timer method to report on elapsed time for each method'''
        return (time.time() - timeVal) / 60

    def cleanData(self):
        '''Perform general data filtering'''
        print('Cleaning data...')
        cleanTimer = time.time()
        data = self.data
        zipIndex = (data['zipcode'].str.isdigit()) | (data['zipcode'].isna())
        data['zipcode'].loc[~zipIndex] = np.nan
        # Format dates as datetime (Time intensive)
        data['createddate'] = pd.to_datetime(data['createddate'])
        data['closeddate'] = pd.to_datetime(data['closeddate'])
        data['servicedate'] = pd.to_datetime(data['servicedate'])
        data['location'] = data.location.astype(str)
        # Check for column consistency
        for f in self.fields:
            if f not in self.data.columns:
                print('\tcolumn %s missing - substituting NaN values' % f)
                data[f] = np.NaN
        for f in data.columns:
            if f not in self.fields:
                print('\tcolumn %s not in defined set - dropping column' % f)
        data = data[self.fields]
        #         self.data = self.data.drop(f)
        self.data = data
        print('\tCleaning Complete: %.1f minutes' %
              self.elapsedTimer(cleanTimer))

    def ingestData(self, ingestMethod='replace'):
        '''Set up connection to database'''
        print('Inserting data into Postgres instance...')
        ingestTimer = time.time()
        data = self.data.copy()  # shard deepcopy for other endpoint operations
        engine = db.create_engine(self.dbString)
        newColumns = [column.replace(' ', '_').lower() for column in data]
        data.columns = newColumns
        # Ingest data
        data.to_sql("ingest_staging_table",
                    engine,
                    if_exists=ingestMethod,
                    schema='public',
                    index=False,
                    chunksize=10000,
                    dtype={'srnumber': String,
                           'createddate': DateTime,
                           'updateddate': DateTime,
                           'actiontaken': String,
                           'owner': String,
                           'requesttype': String,
                           'status': String,
                           'requestsource': String,
                           'createdbyuserorganization': String,
                           'mobileos': String,
                           'anonymous': String,
                           'assignto': String,
                           'servicedate': String,
                           'closeddate': String,
                           'addressverified': String,
                           'approximateaddress': String,
                           'address': String,
                           'housenumber': String,
                           'direction': String,
                           'streetname': String,
                           'suffix': String,
                           'zipcode': Integer,
                           'latitude': Float,
                           'longitude': Float,
                           'location': String,
                           'tbmpage': Integer,
                           'tbmcolumn': String,
                           'tbmrow': Float,
                           'apc': String,
                           'cd': Float,
                           'cdmember': String,
                           'nc': Float,
                           'ncname': String,
                           'policeprecinct': String})
        print('\tIngest Complete: %.1f minutes' %
              self.elapsedTimer(ingestTimer))

    def dumpFilteredCsvFile(self,
                            dataset,
                            startDate,
                            requestType,
                            councilName):
        '''Output data as CSV by council name, request type, and
        start date (pulls to current date). Arguments should be passed
        as strings. Date values must be formatted %Y-%m-%d.'''
        df = dataset.copy()  # Shard deepcopy to allow multiple endpoints
        # Data filtering
        dateFilter = df['CreatedDate'] > startDate
        requestFilter = df['RequestType'] == requestType
        councilFilter = df['NCName'] == councilName
        df = df[dateFilter & requestFilter & councilFilter]
        # Return string object for routing to download
        return df.to_csv()

    def saveCsvFile(self, filename):
        '''Save contents of self.data to CSV output'''
        self.data.to_csv(filename, index=False)

    def fetchSocrata(self, year=2019, querySize=10000):
        '''Fetch data from Socrata connection and return pandas dataframe'''
        # Load config files
        socrata_domain = self.config['Socrata']['DOMAIN']
        socrata_dataset_identifier = self.config['Socrata']['AP' + str(year)]
        socrata_token = self.token
        # Establish connection to Socrata resource
        client = Socrata(socrata_domain, socrata_token)
        # Fetch data
        # metadata = client.get_metadata(socrata_dataset_identifier)
        # Loop for querying dataset
        queryDf = None
        for i in range(0, querySize, 1000):
            print(i)
            results = client.get(socrata_dataset_identifier,
                                 offset=i,
                                 select="*",
                                 order="updateddate DESC")
            tempDf = pd.DataFrame.from_dict(results)
            if queryDf is None:
                queryDf = tempDf.copy()
            else:
                queryDf = queryDf.append(tempDf)
        self.data = queryDf
        # Fetch data
        # metadata = client.get_metadata(socrata_dataset_identifier)

    def fetchSocrataFull(self, year=2019, limit=10**7):
        '''Fetch entirety of dataset via Socrata'''
        # Load config files
        print('Downloading %d data from Socrata data source...' % year)
        downloadTimer = time.time()
        socrata_domain = self.config['Socrata']['DOMAIN']
        socrata_dataset_identifier = self.config['Socrata']['AP' + str(year)]
        socrata_token = self.token
        # Establish connection to Socrata resource
        client = Socrata(socrata_domain, socrata_token)
        results = client.get(socrata_dataset_identifier, limit=limit)
        self.data = pd.DataFrame.from_dict(results)
        print('\tDownload Complete: %.1f minutes' %
              self.elapsedTimer(downloadTimer))

    def populateFullDatabase(self, yearRange=range(2015, 2021)):
        '''Fetches all data from Socrata to populate database
           Default operation is to fetch data from 2015-2020
           !!! Be aware that each fresh import will wipe the
           existing staging table'''
        print('Performing fresh Postgres population from Socrata data sources')
        tableInit = False
        globalTimer = time.time()
        for y in yearRange:
            self.fetchSocrataFull(year=y)
            self.cleanData()
            if not tableInit:
                self.ingestData(ingestMethod='replace')
                tableInit = True
            else:
                self.ingestData(ingestMethod='append')
        print('All Operations Complete: %.1f minutes' %
              self.elapsedTimer(globalTimer))


if __name__ == "__main__":
    '''Class DataHandler workflow from initial load to SQL population'''
    loader = DataHandler()
    loader.loadConfig(configFilePath='../settings.cfg')
    loader.fetchSocrataFull(limit=10000)
    loader.cleanData()
    loader.ingestData()
    loader.saveCsvFile('testfile.csv')
    loader.dumpFilteredCsvFile(dataset="",
                               startDate='2018-05-01',
                               requestType='Bulky Items',
                               councilName='VOICES OF 90037')
