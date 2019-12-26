from configparser import ConfigParser
import sqlalchemy as db
import pandas as pd

class time_to_close(object):
    def __init__(self, config=None, tableName="ingest_staging_table"):
        """
        Choose table from database by setting the value of tableName. Default table is the staging table.
        """
        self.config = config
        self.dbString = None if not self.config else self.config['Database']['DB_CONNECTION_STRING']
        self.table = tableName
        pass

    def ttc_view_columns(self):
        """
        Returns all the columns' names
        """
        engine = db.create_engine(self.dbString)

        query = pd.read_sql_query("SELECT * FROM %s" % self.table, con=engine)

        return query
        
    def ttc_view_all(self):
        """
        Returns all entries
        """
        engine = db.create_engine(self.dbString)

        # The following directly converts SQL data to json objects; for consistency, this function first converts the SQL data to pandas dataframe
        # connection = engine.connect()
        # query = "SELECT row_to_json(ingest_staging_table) \
        #     FROM ingest_staging_table"
        # result = connection.execute(query)
        # connection.close()

        query = pd.read_sql_query("SELECT * FROM %s" % self.table, con=engine)

        return query.to_json(orient='index')

    ### todo:
    ##### request as parameter
    ##### filter by closed status
    ##### 

    ### math method
    ##### return in days?
    ##### 

    ### plot method

if __name__ == "__main__":
    ttc = time_to_close()
    config = ConfigParser()
    config.read("../setting.cfg")
    ttc.config   = config
    ttc.dbString = config['Database']['DB_CONNECTION_STRING']
    ttc.ttc_view_all()
