import pandas as pd
from sqlalchemy import create_engine

class DBSeeder(object):
    def __init__(self, connection_string=None):
        if not connection_string:
            print("ERROR!! Connection string is missing")
            exit(1)
        self.connection_string = connection_string



    def seed_with_file(self, path, table_name="seed_table"):
        df = pd.read_csv(path)
        df.columns = [c.lower() for c in df.columns] #postgres doesn't like capitals or spaces
        engine = create_engine(self.connection_string)
        df.to_sql(table_name, engine)



if __name__ == "__main__":
    seeder = DBSeeder(connection_string="postgresql://REDACTED:REDACTED@localhost:5432/311-user")
    seeder.seed_with_file("../static/MyLA311_Service_Request_Data_2017_Subset.csv", "2017_dataset_trimmed")
