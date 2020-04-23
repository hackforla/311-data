from sqlalchemy import Column, Integer, String, DateTime, Float, JSON
from sqlalchemy.ext.declarative import declarative_base


Base = declarative_base()


class Mixin:
    """
    Adds `_asdict()` to easily serialize objects to dictionaries.
    """
    def _asdict(self):
        cols = self.__table__.columns
        return {col.name: getattr(self, col.name) for col in cols}


class Ingest(Base, Mixin):
    __tablename__ = 'ingest_staging_table'

    # a temporary primary key
    id = Column(Integer, primary_key=True, autoincrement=True)

    # becomes the primary key after deduplication
    srnumber = Column(String)

    # dates
    createddate = Column(DateTime, index=True)
    closeddate = Column(DateTime)
    _daystoclose = Column(Float(1))
    updateddate = Column(DateTime)
    servicedate = Column(DateTime)

    # about
    requesttype = Column(String, index=True)
    requestsource = Column(String)
    actiontaken = Column(String)
    owner = Column(String)
    status = Column(String)
    createdbyuserorganization = Column(String)
    mobileos = Column(String)
    anonymous = Column(String)
    assignto = Column(String)

    # location
    latitude = Column(Float)
    longitude = Column(Float)
    addressverified = Column(String)
    approximateaddress = Column(String)
    address = Column(String)
    housenumber = Column(String)
    direction = Column(String)
    streetname = Column(String)
    suffix = Column(String)
    zipcode = Column(String)
    location = Column(JSON)

    # politics
    apc = Column(String)
    cd = Column(Integer, index=True)
    cdmember = Column(String)
    nc = Column(Integer, index=True)
    ncname = Column(String)
    policeprecinct = Column(String)

    # misc
    tbmpage = Column(String)
    tbmcolumn = Column(String)
    tbmrow = Column(Integer)
