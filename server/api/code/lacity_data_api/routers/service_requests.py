from sqlalchemy import sql
from fastapi import APIRouter

from ..models.schemas import (
    ServiceRequestList, Filters, PinList
)
from ..models.service_request import (
    ServiceRequest, get_open_request_counts, get_open_requests, get_filtered_requests
)
from ..models import db

router = APIRouter()


@router.get("/", response_model=ServiceRequestList)
async def get_all_service_requests(skip: int = 0, limit: int = 100):
    async with db.transaction():
        cursor = await ServiceRequest.query.gino.iterate()
        if skip > 0:
            await cursor.forward(skip)  # skip 80 rows
        result = await cursor.many(limit)  # and retrieve next 10 rows

    return result


@router.get("/open/counts/types")
async def get_open_request_counts_by_type():
    result = await get_open_request_counts()
    return result


@router.post("/pins", response_model=PinList)
async def get_filtered_service_request_pins(filters: Filters):
    result = await get_filtered_requests(
        filters.startDate,
        filters.endDate,
        filters.requestTypes,
        filters.ncList
    )
    return result


@router.get("/pins/open", response_model=PinList)
async def get_open_service_request_pins():
    result = await get_open_requests()
    return result


@router.post("/points")  # , response_model=PointList)
async def get_filtered_service_request_points(filters: Filters):
    result = await ServiceRequest.select(
        'latitude',
        'longitude'
    ).where(
        sql.and_(
            ServiceRequest.created_date >= filters.startDate,
            ServiceRequest.created_date <= filters.endDate,
            ServiceRequest.type_id.in_(filters.requestTypes),
            ServiceRequest.council_id.in_(filters.ncList)
        )
    ).gino.all()
    # return result
    return [[row.latitude, row.longitude] for row in result]


@router.get("/{id}")
async def get_service_request(id: int):
    result = await ServiceRequest.get_or_404(id)
    return result.to_dict()
