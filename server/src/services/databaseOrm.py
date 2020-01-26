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


insertFields = {'srnumber': String,
                'createddate': DateTime,
                'updateddate': DateTime,
                'actiontaken': String,
                'owner': String,
                'requesttype': String,
                'status': String,
                'requestsource': String,
                'createdbyuserorganization': String,
                'mobileos': String,
                'anonymous': String,
                'assignto': String,
                'servicedate': String,
                'closeddate': String,
                'addressverified': String,
                'approximateaddress': String,
                'address': String,
                'housenumber': String,
                'direction': String,
                'streetname': String,
                'suffix': String,
                'zipcode': Integer,
                'latitude': Float,
                'longitude': Float,
                'location': String,
                'tbmpage': Integer,
                'tbmcolumn': String,
                'tbmrow': Float,
                'apc': String,
                'cd': Float,
                'cdmember': String,
                'nc': Float,
                'ncname': String,
                'policeprecinct': String}


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
