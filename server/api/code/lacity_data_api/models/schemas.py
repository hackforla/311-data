from typing import List, Optional
import datetime
from enum import Enum

from pydantic import BaseModel, validator
from pydantic.dataclasses import dataclass


class Filters(BaseModel):
    startDate: datetime.date
    endDate: datetime.date
    requestTypes: List[int]
    ncList: List[int]

    class Config:
        schema_extra = {
            "description": "New version of filters using ints and ISO dates"
        }


class Bounds(BaseModel):
    north: float
    south: float
    east: float
    west: float


class Filter(BaseModel):
    startDate: str
    endDate: str
    ncList: List[int]
    requestTypes: List[str]
    zoom: Optional[int] = None
    bounds: Optional[Bounds] = None

    @validator('startDate', 'endDate')
    def parse_date(cls, v):
        if isinstance(v, str):
            try:
                v = datetime.datetime.strptime(v, '%m/%d/%y')
            except ValueError:
                try:
                    v = datetime.datetime.strptime(v, '%m/%d/%Y')
                except ValueError:
                    try:
                        v = datetime.datetime.strptime(v, '%Y-%m-%d')
                    except ValueError:
                        pass
        return v


class ClassicPin(BaseModel):
    srnumber: str
    requesttype: str
    latitude: float
    longitude: float


class Pin(BaseModel):
    request_id: int
    type_id: int
    latitude: float
    longitude: float

    class Config:
        schema_extra = {
            "description": "New version of lat/long with additional metadata using ints"
        }


class Point(BaseModel):
    latitude: float
    longitude: float

    class Config:
        schema_extra = {
            "description": "A simple lat/long point"
        }


class Cluster(BaseModel):
    count: int
    expansion_zoom: Optional[int]
    id: int
    latitude: float
    longitude: float


@dataclass
class Set:
    district: str
    list: List[int]

    @validator('district')
    def district_is_valid(cls, v):
        assert v in ['cc', 'nc'], 'district must be either "nc" or "cc".'
        return v

    def __getitem__(cls, item):
        return getattr(cls, item)


class Comparison(BaseModel):
    startDate: str
    endDate: str
    requestTypes: List[str]
    set1: Set
    set2: Set


class Feedback(BaseModel):
    title: str
    body: str


class StatusTypes(str, Enum):
    api = "api"
    database = "db"
    cache = "cache"
    log = "log"


class ServiceRequest(BaseModel):
    request_id: int
    srnumber: str
    council_id: int
    type_id: int
    created_date: datetime.date
    closed_date: Optional[datetime.date]
    address: str
    latitude: float
    longitude: float

    class Config:
        orm_mode = True
        schema_extra = {
            "description": "Requests for city services from citizens"
        }


class RequestType(BaseModel):
    type_id: int
    type_name: str
    color: str

    class Config:
        orm_mode = True
        schema_extra = {
            "description": "Categories of service requests"
        }


class Region(BaseModel):
    region_id: int
    region_name: str
    latitude: float
    longitude: float

    class Config:
        orm_mode = True
        schema_extra = {
            "description": "Regions which group neighborhood councils"
        }


class Council(BaseModel):
    council_id: int
    council_name: str
    waddress: str
    region_id: int
    latitude: float
    longitude: float

    class Config:
        orm_mode = True
        schema_extra = {
            "description": "The neighborhood councils in the city"
        }


CouncilList = List[Council]
RegionList = List[Region]
RequestTypeList = List[RequestType]
ServiceRequestList = List[ServiceRequest]
ClusterList = List[Cluster]
PinList = List[Pin]
PointList = List[Point]
