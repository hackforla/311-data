import datetime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, DateTime, Float
from sqlalchemy import create_engine

Base = declarative_base()
class ServiceRequest(Base):
     __tablename__ = 'service_requests'
     id = Column(Integer, primary_key=True, autoincrement=True)
     SRNumber = Column(String, nullable=True)
     CreatedDate = Column(DateTime, nullable=True)#DateTime
     UpdatedDate = Column(DateTime, nullable=True)#DateTime
     ActionTaken = Column(String, nullable=True)
     Owner = Column(String, nullable=True)
     RequestType = Column(String, nullable=True)
     Status = Column(String, nullable=True)
     RequestSource = Column(String, nullable=True)
     MobileOS = Column(String, nullable=True)
     Anonymous = Column(String, nullable=True)
     AssignTo = Column(String, nullable=True)
     ServiceDate = Column(DateTime, nullable=True)#DateTime
     ClosedDate = Column(DateTime, nullable=True)#DateTime
     AddressVerified = Column(String, nullable=True)
     ApproximateAddress = Column(String, nullable=True)
     Address = Column(String, nullable=True)
     HouseNumber = Column(Integer, nullable=True)
     Direction = Column(String, nullable=True)
     StreetName = Column(String, nullable=True)
     Suffix = Column(String, nullable=True)
     ZipCode = Column(Integer, nullable=True)
     Lattitude = Column(Float, nullable=True)#Float
     Longitude = Column(Float, nullable=True)#Float
     Location = Column(String, nullable=True)
     TBMPage = Column(Integer, nullable=True)
     TBMColumn = Column(String, nullable=True)
     TBMRow = Column(Integer, nullable=True)
     APC = Column(String, nullable=True)
     CD = Column(Integer, nullable=True)
     CDMember = Column(String, nullable=True)
     NC = Column(Integer, nullable=True)
     NCName = Column(String, nullable=True)
     PolicePrecinct = Column(String, nullable=True)


     def __repr__(self):
        return "<ServiceRequest(SRNumber='%s', CreatedDate='%s', \
        UpdatedDate='%s', ActionTaken='%s', Owner='%s', RequestType='%s',\
        Status='%s', RequestSource='%s', MobileOS='%s', Anonymous='%s',\
        AssignTo='%s', ServiceDate='%s', ClosedDate='%s',\
        AddressVerified='%s', ApproximateAddress='%s', Address='%s',\
        HouseNumber='%s', Direction='%s', StreetName='%s',\
        Suffix='%s', ZipCode='%s', Lattitude='%s',\
        Longitude='%s', Location='%s', TBMPage='%s',\
        TBMColumn='%s', TBMRow='%s', APC='%s', CD='%s', CDMember='%s', NC='%s',\
        NCName='%s', PolicePrecinct='%s',)>" % (self.name, self.fullname, self.nickname)
