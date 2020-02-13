import sqlalchemy as db
import pandas as pd
from sqlIngest import DataHandler
import databaseOrm


class DataCleaner(DataHandler):
    def __init__(self, config=None, configFilePath=None, separator=','):
        self.data = None
        self.config = config
        self.dbString = None if not self.config \
            else self.config['Database']['DB_CONNECTION_STRING']
        self.filePath = None
        self.configFilePath = configFilePath
        self.separator = separator
        self.fields = databaseOrm.tableFields
        self.insertParams = databaseOrm.insertFields
        self.readParams = databaseOrm.readFields

    def fetchData(self):
        '''Retrieve data from mySql database instance'''
        engine = db.create_engine(self.dbString)
        self.data = pd.read_sql('ingest_staging_table',
                                con=engine,
                                index_col='srnumber')

    def formatData(self):
        '''Perform changes to data formatting to ensure compatibility
           with cleaning and frontend processes'''
        pass

    def groupData(self):
        '''Cluster data by geographic area to remove repeat instances
           of 311 reports'''
        pass

    def cleaningReport(self):
        '''Write out cleaning report summarizing operations performed
           on data as well as data characteristics'''
        pass


if __name__ == "__main__":
    '''Class DataHandler workflow from initial load to SQL population'''
    cleaner = DataCleaner()
    cleaner.loadConfig(configFilePath='../settings.cfg')
    cleaner.fetchData()
    # can use inherited ingestData method to write to table
    cleaner.ingestData(tableName='clean_data')
