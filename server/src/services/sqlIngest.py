import os
import time
import numpy as np
import pandas as pd
import sqlalchemy as db
from sodapy import Socrata
from configparser import ConfigParser
if __name__ == '__main__':
    # Contains db specs and field definitions
    from databaseOrm import tableFields, insertFields, readFields
else:
    from .databaseOrm import tableFields, insertFields, readFields


class DataHandler:
    def __init__(self, config=None, configFilePath=None, separator=','):
        self.data = None
        self.config = config
        self.dbString = None if not self.config \
            else self.config['Database']['DB_CONNECTION_STRING']
        self.token = None if config['Socrata']['TOKEN'] == 'None' \
            else config['Socrata']['TOKEN']
        self.filePath = None
        self.configFilePath = configFilePath
        self.separator = separator
        self.fields = tableFields
        self.insertParams = insertFields
        self.readParams = readFields
        self.dialect = self.dbString.split(':')[0]

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
                                  dtype=self.readParams)

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
        if 'createddate' in data.columns:
            data['createddate'] = pd.to_datetime(data['createddate'])
        if 'closeddate' in data.columns:
            data['closeddate'] = pd.to_datetime(data['closeddate'])
        if 'servicedate' in data.columns:
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

    def ingestData(self, ingestMethod='replace',
                   tableName='ingest_staging_table'):
        '''Set up connection to database'''
        asdf = 'Inserting data into ' + self.dialect + ' instance...'
        print(asdf)
        ingestTimer = time.time()
        data = self.data.copy()  # shard deepcopy for other endpoint operations
        engine = db.create_engine(self.dbString)
        newColumns = [column.replace(' ', '_').lower() for column in data]
        data.columns = newColumns
        # Ingest data
        # Schema is same as database in MySQL;
        # schema here is set to db name in connection string
        data.to_sql(tableName,
                    engine,
                    if_exists=ingestMethod,
                    schema='public',
                    index=False,
                    chunksize=10,
                    method='multi',
                    dtype=self.insertParams)
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
        dateFilter = df['createddate'] > startDate
        requestFilter = df['requesttype'] == requestType
        councilFilter = df['ncname'] == councilName
        df = df[dateFilter & requestFilter & councilFilter]
        # Return string object for routing to download
        return df.to_csv()

    def saveCsvFile(self, filename):
        '''Save contents of self.data to CSV output'''
        self.data.to_csv(filename, index=False)

    def fetchSocrata(self, year=2019, querySize=20000, pageSize=20000):
        '''Fetch data from Socrata connection and return pandas dataframe'''
        # Load config files
        print('Retrieving partial Socrata query...')
        fetchTimer = time.time()
        socrata_domain = self.config['Socrata']['DOMAIN']
        socrata_dataset_identifier = self.config['Socrata']['AP' + str(year)]
        socrata_token = self.token
        # Establish connection to Socrata resource
        client = Socrata(socrata_domain, socrata_token)
        # Fetch data
        # Loop for querying dataset
        queryDf = None
        for i in range(0, querySize, pageSize):
            # print(i + pageSize)
            results = client.get(socrata_dataset_identifier,
                                 offset=i,
                                 select="*",
                                 order="updateddate DESC",
                                 limit=querySize)
            tempDf = pd.DataFrame.from_dict(results)
            if queryDf is None:
                queryDf = tempDf.copy()
            else:
                queryDf = queryDf.append(tempDf)
        self.data = queryDf
        print('%d records retrieved in %.2f minutes' %
              (self.data.shape[0], self.elapsedTimer(fetchTimer)))

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

    def populateFullDatabase(self, yearRange=range(2015, 2021), limit=None):
        '''Fetches all data from Socrata to populate database
           Default operation is to fetch data from 2015-2020
           !!! Be aware that each fresh import will wipe the
           existing staging table'''
        print('Performing {} population from data source'.format(self.dialect))
        tableInit = False
        globalTimer = time.time()
        for y in yearRange:
            self.fetchSocrataFull(year=y, limit=limit)
            self.cleanData()
            if not tableInit:
                self.ingestData(ingestMethod='replace')
                tableInit = True
            else:
                self.ingestData(ingestMethod='append')
        print('All Operations Complete: %.1f minutes' %
              self.elapsedTimer(globalTimer))

    def updateDatabase(self):
        '''Incrementally updates database with contents of data attribute
           overwriting pre-existing records with the same srnumber'''
        def fix_nan_vals(resultDict):
            '''sqlAlchemy will not take NaT or NaN values for
               insert in some fields. They must be replaced
               with None values'''
            for key in resultDict:
                if resultDict[key] is pd.NaT or resultDict[key] is np.nan:
                    resultDict[key] = None
                # Also doesn't like nested dictionaries
                if type(resultDict[key]) is dict:
                    resultDict[key] = str(resultDict[key])
            return resultDict

        print('Updating database with new records...')
        engine = db.create_engine(self.dbString)
        metadata = db.MetaData()
        staging = db.Table('ingest_staging_table',
                           metadata,
                           autoload=True,
                           autoload_with=engine)
        connection = engine.connect()
        row = None
        updateTimer = time.time()
        updated = 0
        inserted = 0
        for srnumber in self.data.srnumber:
            stmt = (db.select([staging])
                      .where(staging.columns.srnumber == srnumber))
            results = connection.execute(stmt).fetchall()
            # print(srnumber, results)
            # Delete the record if it is already there
            if len(results) > 0:
                delete_stmt = (db.delete(staging)
                                 .where(staging.columns.srnumber == srnumber))
                connection.execute(delete_stmt)
                updated += 1
            else:
                inserted += 1
            # Write record
            insert_stmt = db.insert(staging)
            row = self.data[self.data.srnumber == srnumber].to_dict('results')
            row = [fix_nan_vals(r) for r in row]
            connection.execute(insert_stmt, row)
        print('Operation Complete: %d inserts, %d updates in %.2f minutes' %
              (inserted, updated, self.elapsedTimer(updateTimer)))


if __name__ == "__main__":
    '''Class DataHandler workflow from initial load to SQL population'''
    config = ConfigParser()
    config.read('../settings.cfg')
    loader = DataHandler(config)
    loader.fetchSocrataFull()
    loader.cleanData()
    loader.ingestData('ingest_staging_table')
