from configparser import ConfigParser
from sqlalchemy.types import Integer, Text, String, DateTime, Float
from sqlalchemy import create_engine

class time_to_close(object):
    def __init__(self, config=None):
        self.config = config
        self.dbString = None if not self.config else self.config['Database']['DB_CONNECTION_STRING']
        pass

    def hello_world(self):
        engine = create_engine(self.dbString)

        connection = engine.connect()
        query = "SELECT row_to_json(CreatedDate) \
            FROM ingest_staging_table"
        result = connection.execute(query)
        connection.close()

        return result

if __name__ == "__main__":
    time2close = time_to_close(ConfigParser().read('../settings.cfg'))
    time2close.hello_world()
