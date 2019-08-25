import csv
from sqlalchemy.orm import sessionmaker
import pandas as pd
from numpy import genfromtxt
from sqlalchemy import create_engine
from models import ServiceRequest



from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, ForeignKey, Integer, String, Float, Boolean
from sqlalchemy import Index
from sqlalchemy.orm import relationship, backref

Base = declarative_base()

class DBSeeder(object):
    def __init__(self, connection_string=None):
        if not connection_string:
            print("ERROR!! Connection string is missing")
            exit(1)
        self.connection_string = connection_string

    def Load_Data(file_name):
        data = genfromtxt(file_name, delimiter=',', skip_header=1, converters={0: lambda s: str(s)})
        return data.tolist()

    def load_from_csv(self, csv_file, table_name):
        with open(csv_file) as csv_obj:
            csv_reader = csv.reader(csv_obj, delimiter=',')
            next(csv_reader)
            Session = sessionmaker()
            engine = create_engine(self.connection_string)
            Session.configure(bind=engine)

            sess = Session()
            ServiceRequest.metadata.create_all(engine)
            bulk = []
            for idx,row in enumerate(csv_reader):
                sRequest = ServiceRequest(SRNumber = row[0],\
                  CreatedDate = row[1] or None,\
                  UpdatedDate = row[2] or None,\
                  ActionTaken = row[3],\
                  Owner = row[4],\
                  RequestType = row[5],\
                  Status = row[6],\
                  RequestSource = row[7],\
                  MobileOS = row[8],\
                  Anonymous = row[9],\
                  AssignTo = row[10],\
                  ServiceDate = row[11] or None,\
                  ClosedDate = row[12] or None,\
                  AddressVerified = row[13],\
                  ApproximateAddress = row[14],\
                  Address = row[15],\
                  HouseNumber = row[16] or None,\
                  Direction = row[17],\
                  StreetName = row[18],\
                  Suffix = row[19],\
                  ZipCode = row[20] or None,\
                  Lattitude = row[21] or None,\
                  Longitude = row[22] or None,\
                  Location = row[23],\
                  TBMPage = row[24] or None,\
                  TBMColumn = row[25],\
                  TBMRow = row[26] or None,\
                  APC = row[27],\
                  CD = row[28] or None,\
                  CDMember = row[29],\
                  NC = row[30] or None,\
                  NCName = row[31],\
                  PolicePrecinct = row[32])
                bulk.append(sRequest)
                #sess.add(sRequest)
                if idx % 1000 == 0:
                    sess.bulk_save_objects(bulk)
                    sess.commit()
                    sess.flush()
                    print(str(idx) + ".")
                    bulk = []

            sess.bulk_save_objects(bulk)
            sess.commit()
            sess.close()



    def seed_with_file(self, path, table_name="seed_table"):
        df = pd.read_csv(path, skip_header=True)
        df.columns = [c.lower() for c in df.columns] #postgres doesn't like capitals or spaces
        engine = create_engine(self.connection_string)
        df.to_sql(table_name, engine)



if __name__ == "__main__":
    import os
    seeder = DBSeeder(connection_string="postgresql://REDACTED:REDACTED@localhost:5432/311-user")
    seeder.load_from_csv(os.path.join("/path/to/data/file","MyLA311_Service_Request_Data_2018.csv"), "2017_dataset_trimmed")
