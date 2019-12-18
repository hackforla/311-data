from configparser import ConfigParser
from sqlalchemy.types import Integer, Text, String, DateTime, Float
from sqlalchemy import create_engine

class frequency(object):
    def __init__(self, config=None):
        self.config = config
        self.dbString = None if not self.config else self.config['Database']['DB_CONNECTION_STRING']
        pass

    def freq_query(self):
        engine = create_engine(self.dbString)

        connection = engine.connect()
        query = "SELECT row_to_json(row(status)) \
            FROM ingest_staging_table"
        result = connection.execute(query)
        connection.close()

        return result

if __name__ == "__main__":
    frequer = frequency()
    config = ConfigParser()
    config.read("../setting.cfg")
    frequer.config   = config
    frequer.dbString = config['Database']['DB_CONNECTION_STRING']
    frequer.freq_query()
