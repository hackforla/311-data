from typing import List, Optional
import datetime
from enum import Enum

from pydantic import BaseModel, validator
from pydantic.dataclasses import dataclass


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
                v = datetime.datetime.strptime(v, '%m/%d/%Y')
            except ValueError:
                try:
                    v = datetime.datetime.strptime(v, '%Y-%m-%d')
                except ValueError:
                    pass
        return v


class Pin(BaseModel):
    srnumber: str
    requesttype: str
    latitude: float
    longitude: float


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
    system = "sys"
    cache = "cache"


Pins = List[Pin]
Clusters = List[Cluster]
