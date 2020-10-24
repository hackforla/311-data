from sqlalchemy import sql
from fastapi import APIRouter

from ..models.schemas import (
    ServiceRequestList, Filters
)
from ..models.service_request import ServiceRequest, get_open_request_counts
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


@router.get("/open", response_model=ServiceRequestList)
async def get_open_service_requests():
    result = await ServiceRequest.query.where(
        ServiceRequest.closed_date == None  # noqa
    ).gino.all()
    return result


@router.get("/open/counts/types")
async def get_open_counts_by_type():
    result = await get_open_request_counts()
    return result


@router.post("/pins", response_model=ServiceRequestList)
async def get_service_request_pins(filters: Filters):
    result = await ServiceRequest.query.where(
        sql.and_(
            ServiceRequest.created_date >= filters.startDate,
            ServiceRequest.created_date <= filters.endDate,
            ServiceRequest.type_id.in_(filters.requestTypes),
            ServiceRequest.council_id.in_(filters.ncList)
        )
    ).gino.all()
    return result


@router.post("/points")  # , response_model=PointList)
async def get_service_request_points(filters: Filters):
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


@router.get("/{id}", description="""
    The service request ID is the integer created from the srnumber
    when the initial "1-" is removed.
    """)
async def get_service_request(id: int):
    result = await ServiceRequest.get_or_404(id)
    return result.to_dict()


# # TODO: implement conditional cluster logic based on zoom
# @router.post("/clusters", response_model=ClusterList)
# async def get_service_request_clusters(filter: Filter):

#     result = await clusters.get_clusters_for_city(
#         filter.startDate,
#         filter.endDate,
#         filter.requestTypes
#     )

#     return result
