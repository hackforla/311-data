import datetime
from typing import Optional

from sqlalchemy import sql
from fastapi import APIRouter

from ..models.api_models import (
    ServiceRequestList, Filters, PinList, TypeCountList
)
from ..models.service_request import (
    ServiceRequest, get_open_request_counts, get_open_requests, get_filtered_requests
)

router = APIRouter()


# TODO: #942 default to last week's data if no limit provided
@router.get("", response_model=ServiceRequestList)
async def get_all_service_requests(
    start_date: datetime.date = datetime.date.today() - datetime.timedelta(days=7),
    end_date: datetime.date = None,
    type_id: Optional[int] = None,
    council_id: Optional[int] = None,
):
    type_ids = []
    council_ids = []

    if type_id:
        type_ids = [type_id]
    if council_id:
        council_ids = [council_id]

    result = await get_filtered_requests(
        start_date=start_date,
        end_date=end_date,
        type_ids=type_ids,
        council_ids=council_ids
    )

    return result


@router.get("/counts/open/types", response_model=TypeCountList)
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
