from configparser import ConfigParser
from sqlalchemy.types import Integer, Text, String, DateTime, Float
from sqlalchemy import create_engine

class time_to_close(object):
    def __init__(self, config=None):
        self.config = config
        self.dbString = None if not self.config else self.config['Database']['DB_CONNECTION_STRING']
        pass

    def ttc_query(self):
        engine = create_engine(self.dbString)

        connection = engine.connect()
        query = "SELECT row_to_json(row(status)) \
            FROM ingest_staging_table"
        result = connection.execute(query)
        connection.close()

        return result

if __name__ == "__main__":
    ttc = time_to_close()
    config = ConfigParser()
    config.read("../setting.cfg")
    ttc.config   = config
    ttc.dbString = config['Database']['DB_CONNECTION_STRING']
    ttc.ttc_query()
