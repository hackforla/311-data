from typing import List, Optional
import datetime

from sqlalchemy import sql
from fastapi import APIRouter
from pydantic import BaseModel

from ..models.service_request import ServiceRequest
from ..models import db, clusters

router = APIRouter()


class ServiceRequestModel(BaseModel):
    request_id: int
    council_id: int
    type_id: int
    created_date: datetime.date
    closed_date: Optional[datetime.date]
    address: str
    latitude: float
    longitude: float

    class Config:
        orm_mode = True


Items = List[ServiceRequestModel]


@router.get("/", response_model=Items)
async def index(skip: int = 0, limit: int = 100):
    async with db.transaction():
        cursor = await ServiceRequest.query.gino.iterate()
        if skip > 0:
            await cursor.forward(skip)  # skip 80 rows
        result = await cursor.many(limit)  # and retrieve next 10 rows

    return result


@router.get("/{srid}")
async def get_service_request(srid: int):
    svcreq = await ServiceRequest.get_or_404(srid)
    return svcreq.to_dict()


class Bounds(BaseModel):
    north: float
    south: float
    east: float
    west: float


class Filter(BaseModel):
    startDate: datetime.date
    endDate: datetime.date
    ncList: List[int]
    requestTypes: List[int]
    zoom: Optional[int] = None
    bounds: Optional[Bounds] = None


class Cluster(BaseModel):
    count: int
    expansion_zoom: int
    id: int
    latitude: float
    longitude: float


Clusters = List[Cluster]


class Pin(BaseModel):
    request_id: int
    type_id: int
    latitude: float
    longitude: float


Pins = List[Pin]


@router.post("/pins", response_model=Items)
async def get_service_request_pins(filter: Filter):
    result = await ServiceRequest.query.where(
        sql.and_(
            ServiceRequest.created_date >= filter.startDate,
            ServiceRequest.created_date <= filter.endDate,
            ServiceRequest.type_id.in_(filter.requestTypes),
            ServiceRequest.council_id.in_(filter.ncList)
        )
    ).gino.all()
    return result


@router.post("/clusters", response_model=Clusters)
async def get_service_request_clusters(filter: Filter):

    result = await clusters.get_clusters_for_city(
        filter.startDate,
        filter.endDate,
        filter.requestTypes
    )

    # result = await ServiceRequest.query()
    #     .where(
    #     sql.and_(
            # ServiceRequest.created_date >= filter.startDate,
            # ServiceRequest.created_date <= filter.endDate,
            # ServiceRequest.type_id.in_(filter.requestTypes),
            # ServiceRequest.council_id.in_(filter.ncList)
    #     )
    # ).gino.all()

    # # council

    # # street
    # if filter.zoom > 9:
    #     cluster_result = clusters.get_clusters_for_regions(result, filter.zoom, filter.bounds, options={})
    # else:
    #     cluster_result = clusters.get_clusters_for_pins(result, filter.zoom, filter.bounds, options={})

    return result
