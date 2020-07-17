from sqlalchemy import Column, Integer, String, DateTime, Float, JSON
from sqlalchemy.ext.declarative import declarative_base
from ...conn import engine, Session, exec_sql


Base = declarative_base()


class Stage(Base):
    __tablename__ = 'stage'

    # a temporary primary key
    id = Column(Integer, primary_key=True, autoincrement=True)

    # becomes the primary key after deduplication
    srnumber = Column(String)

    # dates
    createddate = Column(DateTime)
    closeddate = Column(DateTime)
    _daystoclose = Column(Float(1))
    updateddate = Column(DateTime)
    servicedate = Column(DateTime)

    # about
    requesttype = Column(String)
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
    cd = Column(Integer)
    cdmember = Column(String)
    nc = Column(Integer)
    ncname = Column(String)
    policeprecinct = Column(String)

    # misc
    tbmpage = Column(String)
    tbmcolumn = Column(String)
    tbmrow = Column(Integer)


def drop():
    exec_sql('DROP TABLE IF EXISTS stage')


def create():
    drop()
    Base.metadata.create_all(engine)


def insert(rows):
    session = Session()
    session.bulk_insert_mappings(Stage, rows)
    session.commit()
    session.close()
