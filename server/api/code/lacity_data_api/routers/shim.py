from typing import List, Optional
import datetime

from fastapi import APIRouter
from pydantic import BaseModel

from lacity_data_api.models import clusters, request_type

router = APIRouter()

"""
These are new backward-compatible router routes. They implement the existing API
methods but get data from the new models using async database queries.
"""


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


@router.post("/new/clusters")
async def get_new_clusters(filter: Filter):
    # have to convert the funky date formats
    start_date = datetime.datetime.strptime(filter.startDate, '%m/%d/%Y')
    end_date = datetime.datetime.strptime(filter.endDate, '%m/%d/%Y')

    # convert type names to type ids
    request_types = await request_type.get_types_by_str_list(filter.requestTypes)
    type_ids = [i.type_id for i in request_types]

    zoom = filter.zoom or 10

    if zoom < 11:
        # get city clusters
        result = await clusters.get_clusters_for_city(
            start_date,
            end_date,
            type_ids,
            filter.zoom
        )
    elif zoom < 14:
        result = await clusters.get_clusters_for_councils(
            start_date,
            end_date,
            type_ids,
            filter.ncList,
            filter.zoom
        )
    else:
        result = await clusters.get_clusters_for_bounds(
            start_date,
            end_date,
            type_ids,
            filter.ncList,
            filter.zoom,
            filter.bounds
        )

    return result


@router.post("/new/heat")
async def get_new_heatmap(filter: Filter):
    start_time = datetime.datetime.strptime(filter.startDate, '%m/%d/%Y')
    end_time = datetime.datetime.strptime(filter.endDate, '%m/%d/%Y')

    # convert type names to type ids
    request_types = await request_type.get_types_by_str_list(filter.requestTypes)
    type_ids = [i.type_id for i in request_types]

    result = await clusters.get_points(
        start_time,
        end_time,
        type_ids,
        filter.ncList
    )
    return result
