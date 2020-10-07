from sqlalchemy import sql
from fastapi import APIRouter

from ..models.schemas import (
    ServiceRequestList, Filter
)
from ..models.service_request import ServiceRequest
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


@router.get("/{id}", description="""
    The service request ID is the integer created from the srnumber
    when the initial "1-" is removed.
    """)
async def get_service_request(id: int):
    result = await ServiceRequest.get_or_404(id)
    return result.to_dict()


@router.post("/pins", response_model=ServiceRequestList)
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


# # TODO: implement conditional cluster logic based on zoom
# @router.post("/clusters", response_model=ClusterList)
# async def get_service_request_clusters(filter: Filter):

#     result = await clusters.get_clusters_for_city(
#         filter.startDate,
#         filter.endDate,
#         filter.requestTypes
#     )

#     return result
