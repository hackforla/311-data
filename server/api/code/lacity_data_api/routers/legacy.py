from typing import List, Optional
import datetime

from fastapi import responses
from fastapi import APIRouter
from pydantic import BaseModel

from services import status, map, visualizations, requests, comparison, github, email

router = APIRouter()

"""
These are router classes that implement the existing API design and
use the legacy services code from src as-is.
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


class Pin(BaseModel):
    srnumber: str
    requesttype: str
    latitude: float
    longitude: float


Pins = List[Pin]


class Cluster(BaseModel):
    count: int
    expansion_zoom: Optional[int]
    id: int
    latitude: float
    longitude: float


Clusters = List[Cluster]


class Set(dict):
    district: str
    list: List[int]


class Comparison(BaseModel):
    startDate: str
    endDate: str
    requestTypes: List[str]
    set1: Set
    set2: Set


class Feedback(BaseModel):
    title: str
    body: str


@router.get("/status/api", description="Provides the status of backend systems")
async def status_api():
    result = await status.api()
    return result


@router.get("/status/db")
async def status_db():
    result = await status.database()
    return result


@router.get("/status/sys")
async def status_system():
    result = await status.system()
    return result


@router.get("/servicerequest/{srnumber}")
async def get_service_request_by_string(srnumber: str):
    result = requests.item_query(srnumber)
    return result


@router.post("/open-requests")
async def get_open_requests():
    result = await requests.open_requests()
    return result


# NOTE: can't apply response filter here since it sometimes returns a single point
@router.post("/map/clusters")
async def get_clusters(filter: Filter):
    start_time = datetime.datetime.strptime(filter.startDate, '%m/%d/%Y')
    end_time = datetime.datetime.strptime(filter.endDate, '%m/%d/%Y')

    result = await map.pin_clusters(start_time,
                                    end_time,
                                    filter.requestTypes,
                                    filter.ncList,
                                    filter.zoom,
                                    dict(filter.bounds)
                                    )
    return result


@router.post("/map/heat")
async def get_heatmap(filter: Filter):
    start_time = datetime.datetime.strptime(filter.startDate, '%m/%d/%Y')
    end_time = datetime.datetime.strptime(filter.endDate, '%m/%d/%Y')

    result = await map.heatmap(startDate=start_time,
                                    endDate=end_time,
                                    requestTypes=filter.requestTypes,
                                    ncList=filter.ncList)
    return responses.JSONResponse(result.tolist())


@router.post("/map/pins", response_model=Pins)
async def get_pins(filter: Filter):
    start_time = datetime.datetime.strptime(filter.startDate, '%m/%d/%Y')
    end_time = datetime.datetime.strptime(filter.endDate, '%m/%d/%Y')

    result = await map.pins(startDate=start_time,
                                    endDate=end_time,
                                    requestTypes=filter.requestTypes,
                                    ncList=filter.ncList)
    return result


@router.post("/visualizations")
async def get_visualizations(filter: Filter):
    start_time = datetime.datetime.strptime(filter.startDate, '%m/%d/%Y')
    end_time = datetime.datetime.strptime(filter.endDate, '%m/%d/%Y')

    result = await visualizations.visualizations(startDate=start_time,
                                    endDate=end_time,
                                    requestTypes=filter.requestTypes,
                                    ncList=filter.ncList)
    return result


@router.post("/comparison/frequency")
async def get_comparison_frequency(comp_filter: Comparison):
    result = await comparison.freq_comparison(**dict(comp_filter))
    return result


@router.post("/comparison/timetoclose")
async def get_comparison_time_to_close(comp_filter: Comparison):
    result = await comparison.ttc_comparison(**dict(comp_filter))
    return result


@router.post("/comparison/counts")
async def get_comparison_counts(comp_filter: Comparison):
    result = await comparison.counts_comparison(**dict(comp_filter))
    return result


@router.post("/feedback")
async def get_feedback(feedback: Feedback):
    id, number = await github.create_issue(feedback.title, feedback.body)
    await github.add_issue_to_project(id)
    await email.respond_to_feedback(feedback.body, number)

    return {'success': True}
