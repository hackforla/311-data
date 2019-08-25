from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session,sessionmaker
from .models import ServiceRequest

class DataRepository(object):
    def __init__(self, connection_string=None):
        if not connection_string:
            print("ERROR! Missing connection string")
            exit(1)
        self.connection_string = connection_string
        Session = sessionmaker()
        self.engine = create_engine(self.connection_string)
        pass

    def Create(self):
        pass

    def Read(self, target_view):
        with self.engine.connect() as con:
            rs = con.execute('SELECT * FROM ' + target_view)
            return  rs


    def Update(self):
        pass

    def Delete(self):
        pass


if __name__ == "__main__":
    repo = DataRepository(connection_string="postgresql://REDACTED:REDACTED@localhost:5432/311-user")
    repo.Read()
