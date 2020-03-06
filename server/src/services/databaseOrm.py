from sqlalchemy import Column, Integer, String, DateTime, Float
from sqlalchemy.ext.declarative import declarative_base


Base = declarative_base()


class Ingest(Base):
    __tablename__ = 'ingest_staging_table'
    srnumber = Column(String(50), primary_key=True, unique=True)
    createddate = Column(DateTime)
    updateddate = Column(DateTime)
    actiontaken = Column(String)
    owner = Column(String)
    requesttype = Column(String)
    status = Column(String)
    requestsource = Column(String)
    createdbyuserorganization = Column(String)
    mobileos = Column(String)
    anonymous = Column(String)
    assignto = Column(String)
    servicedate = Column(String)
    closeddate = Column(String)
    addressverified = Column(String)
    approximateaddress = Column(String)
    address = Column(String)
    housenumber = Column(String)
    direction = Column(String)
    streetname = Column(String)
    suffix = Column(String)
    zipcode = Column(String)
    latitude = Column(String)
    longitude = Column(String)
    location = Column(String)
    tbmpage = Column(String)
    tbmcolumn = Column(String)
    tbmrow = Column(String)
    apc = Column(String)
    cd = Column(String)
    cdmember = Column(String)
    nc = Column(String)
    ncname = Column(String)
    policeprecinct = Column(String)


insertFields = {'srnumber': String(50),
                'createddate': DateTime,
                'updateddate': DateTime,
                'actiontaken': String(30),
                'owner': String(10),
                'requesttype': String(30),
                'status': String(20),
                'requestsource': String(30),
                'createdbyuserorganization': String(16),
                'mobileos': String(10),
                'anonymous': String(10),
                'assignto': String(20),
                'servicedate': String(30),
                'closeddate': String(30),
                'addressverified': String(16),
                'approximateaddress': String(20),
                'address': String(250),
                'housenumber': String(10),
                'direction': String(10),
                'streetname': String(50),
                'suffix': String(10),
                'zipcode': Integer,
                'latitude': Float,
                'longitude': Float,
                'location': String(250),
                'tbmpage': Integer,
                'tbmcolumn': String(10),
                'tbmrow': Float,
                'apc': String(30),
                'cd': Float,
                'cdmember': String(30),
                'nc': Float,
                'ncname': String(30),
                'policeprecinct': String(30)}


readFields = {'SRNumber': str,
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
              'PolicePrecinct': str}


tableFields = ['srnumber', 'createddate', 'updateddate', 'actiontaken',
               'owner', 'requesttype', 'status', 'requestsource',
               'createdbyuserorganization', 'mobileos', 'anonymous',
               'assignto', 'servicedate', 'closeddate', 'addressverified',
               'approximateaddress', 'address', 'housenumber', 'direction',
               'streetname', 'suffix', 'zipcode', 'latitude', 'longitude',
               'location', 'tbmpage', 'tbmcolumn', 'tbmrow', 'apc', 'cd',
               'cdmember', 'nc', 'ncname', 'policeprecinct']
