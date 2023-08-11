import datetime
from typing import Optional

from fastapi import APIRouter, HTTPException, Query

from ..models import api_models as schemas
from ..models.service_request import (
    ServiceRequest,
    get_id_from_srnumber,
    get_open_request_counts,
    get_open_requests,
    get_filtered_requests
)

router = APIRouter()


def createFeature(row):
    item = dict(row)
    return {
        "type": "Feature",
        "properties": {
            "request_id": item['request_id'],
            "type_id": item['type_id'],
        },
        "geometry": {
            "type": "Point",
            "coordinates": [item['longitude'], item['latitude']]
        }
    }


# TODO: need more tests
@router.get("", response_model=schemas.ServiceRequestList)
async def get_all_service_requests(
    start_date: datetime.date = None,
    end_date: datetime.date = None,
    type_id: Optional[int] = None,
    council_id: Optional[int] = None,
    skip: int = 0,
    limit: int = Query(1000, le=100000)
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
        council_ids=council_ids,
        offset=skip,
        limit=limit
    )

    return result


# TODO: need more tests
# TODO #982 need to make sure this is filtering properly
@router.get("/updated", response_model=schemas.ServiceRequestList)
async def get_updated_service_requests(
    start_date: datetime.date = None,
    end_date: datetime.date = None,
    type_id: Optional[int] = None,
    council_id: Optional[int] = None,
    skip: int = 0,
    limit: int = Query(1000, le=100000)
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
        council_ids=council_ids,
        include_updated=True,
        offset=skip,
        limit=limit
    )

    return result


@router.get("/counts/open/types", response_model=schemas.TypeCountList)
async def get_open_request_counts_by_type():
    result = await get_open_request_counts()
    return result


@router.post("/pins", response_model=schemas.PinList)
async def post_filtered_service_request_pins(filters: schemas.Filters):
    result = await get_filtered_requests(
        filters.start_date,
        filters.end_date,
        filters.type_ids,
        filters.council_ids
    )
    return result


@router.get("/pins/open", response_model=schemas.PinList)
async def get_open_service_request_pins():
    result = await get_open_requests()
    return result


@router.get("/pins/open/geojson")
async def get_open_service_request_pin_geojson():
    result = await get_open_requests()

    features = []
    for i in result:
        features.append(createFeature(i))

    return {
        "type": "FeatureCollection",
        "features": features
    }


# @router.post("/points")  # , response_model=PointList)
# async def get_filtered_service_request_points(filters: schemas.Filters):
#     result = await ServiceRequest.select(
#         'latitude',
#         'longitude'
#     ).where(
#         sql.and_(
#             ServiceRequest.created_date >= filters.start_date,
#             ServiceRequest.created_date <= filters.end_date,
#             ServiceRequest.type_id.in_(filters.type_ids),
#             ServiceRequest.council_id.in_(filters.council_ids)
#         )
#     ).gino.all()
#     # return result
#     return [[row.latitude, row.longitude] for row in result]


@router.get("/{id}", response_model=schemas.ServiceRequest)
async def get_service_request(id: int):
    result = await ServiceRequest.one(id)
    if not result:
        raise HTTPException(status_code=404, detail="Item not found")
    return result


@router.get("/srnumber/{srnumber}", response_model=schemas.ServiceRequest)
async def get_service_request_by_srnumber(srnumber: str):
    id = await get_id_from_srnumber(srnumber)
    result = await ServiceRequest.one(id)
    if not result:
        raise HTTPException(status_code=404, detail="Item not found")
    return result
