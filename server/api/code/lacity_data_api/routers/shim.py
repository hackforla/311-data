import datetime

from fastapi import APIRouter
from pydantic import BaseModel

from .api_models import (
    Filter, StatusTypes  # Pins, Comparison, Feedback
)
from ..models import (
    clusters, request_type, service_request
)
from .utilities import build_cache
from ..config import cache

router = APIRouter()

"""
These are new backward-compatible router routes. They implement the existing API
methods but get data from the new models using async database queries.
"""


class SimpleServiceRequest(BaseModel):
    request_id: int
    type_id: int
    latitude: float
    longitude: float

    class Config:
        orm_mode = True


@router.get("/status/{status_type}",
            description="Provides the status of backend systems")
async def status_check(status_type: StatusTypes):
    if status_type == StatusTypes.api:
        currentTime = datetime.datetime.now()
        last_pulled = datetime.datetime.now()

        await build_cache()

        # SELECT last_pulled FROM metadata
        return {
            'currentTime': currentTime,
            'gitSha': "DEVELOPMENT",
            'version': "0.1.1",
            'lastPulled': last_pulled
        }

    if status_type == StatusTypes.cache:
        return cache



# TODO: return format is slightly different than current
@router.get("/servicerequest/{srnumber}", description="""
    The service request ID is the integer created from the srnumber
    when the initial "1-" is removed.
    """)
async def shim_get_service_request(srnumber: str):
    id = int(srnumber[2:])
    result = await service_request.ServiceRequest.get_or_404(id)
    return result.to_dict()


# TODO: return format is slightly different than current
@router.post("/open-requests")
async def get_open_requests():
    result = await service_request.get_open_requests()

    requests_list = []

    types_dict = await request_type.get_types_dict()

    for i in result:
        requests_list.append({
            'srnumber': f"1-{i.request_id}",
            'requesttype': types_dict.get(i.type_id),
            'latitude': i.latitude,
            'longitude': i.longitude
        })

    return requests_list


@router.post("/map/clusters")
async def get_clusters(filter: Filter):
    # convert type names to type ids
    request_types = await request_type.get_types_by_str_list(filter.requestTypes)
    type_ids = [i.type_id for i in request_types]

    result = await clusters.get_clusters_for_bounds(
        filter.startDate,
        filter.endDate,
        type_ids,
        filter.ncList,
        filter.zoom,
        filter.bounds
    )

    return result


# TODO: tries clustering by district and NC first
@router.post("/new/clusters")
async def shim_get_clusters(filter: Filter):
    # have to convert the funky date formats
    start_date = datetime.datetime.strptime(filter.startDate, '%m/%d/%Y')
    end_date = datetime.datetime.strptime(filter.endDate, '%m/%d/%Y')

    # convert type names to type ids
    request_types = await request_type.get_types_by_str_list(filter.requestTypes)
    type_ids = [i.type_id for i in request_types]

    zoom = filter.zoom or 10

    if zoom < 12:
        # get region clusters
        result = await clusters.get_clusters_for_regions(
            start_date,
            end_date,
            type_ids,
            filter.ncList,
            filter.zoom
        )
    elif zoom < 14:
        # get council clusters
        result = await clusters.get_clusters_for_councils(
            start_date,
            end_date,
            type_ids,
            filter.ncList,
            filter.zoom
        )
    else:
        # use pysupercluster to cluster viewing area
        result = await clusters.get_clusters_for_bounds(
            start_date,
            end_date,
            type_ids,
            filter.ncList,
            filter.zoom,
            filter.bounds
        )

    return result


@router.post("/map/heat")
async def shim_get_heatmap(filter: Filter):

    # convert type names to type ids
    request_types = await request_type.get_types_by_str_list(filter.requestTypes)
    type_ids = [i.type_id for i in request_types]

    result = await clusters.get_points(
        filter.startDate,
        filter.endDate,
        type_ids,
        filter.ncList
    )
    return result


# TODO: currently a placeholder
@router.post("/visualizations")
async def shim_get_visualizations(filter: Filter):
    result_object = {
        "frequency": {
            "bins": [
                "2020-01-01",
                "2020-01-21",
                "2020-02-10",
                "2020-03-01",
                "2020-03-21",
                "2020-04-10",
                "2020-04-30",
                "2020-05-20",
                "2020-06-09",
                "2020-06-29",
                "2020-07-19",
                "2020-08-08",
                "2020-08-28",
                "2020-09-17"
            ],
            "counts": {
                "Dead Animal Removal": [
                    20,
                    31,
                    16,
                    21,
                    16,
                    22,
                    23,
                    15,
                    17,
                    22,
                    19,
                    25,
                    7
                ]
            }
        },
        "timeToClose": {
            "Dead Animal Removal": {
                "min": 0.001632,
                "q1": 0.043319,
                "median": 0.123883,
                "q3": 0.693608,
                "max": 2.700694,
                "whiskerMin": 0.001632,
                "whiskerMax": 1.03765,
                "count": 254,
                "outlierCount": 2
            }
        },
        "counts": {
            "type": {
                "Dead Animal Removal": 254
            },
            "source": {
                "Call": 165,
                "Driver Self Report": 1,
                "Mobile App": 36,
                "Self Service": 50,
                "Voicemail": 2
            }
        }
    }
    return result_object
