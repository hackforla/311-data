from typing import List, Optional
import datetime

from fastapi import responses
from fastapi import APIRouter
from pydantic import BaseModel

from services import status, map, visualizations, requests

router = APIRouter()


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


@router.get("/")
async def index():
    return {"message": "Hello, new index!"}


@router.get("/status/api")
async def status_api():
    result = await status.api()
    return result


@router.get("/status/db")
async def status_db():
    result = await status.database()
    return result


@router.get("/status/system")
async def status_system():
    result = await status.system()
    return result


@router.get("/servicerequest/{srnumber}")
async def get_service_request_by_string(srnumber: str):
    # result = await get_service_request(int(srnumber[2:]))
    result = requests.item_query(srnumber)
    return result


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


@router.post("/visualizations")
async def get_visualizations(filter: Filter):
    start_time = datetime.datetime.strptime(filter.startDate, '%m/%d/%Y')
    end_time = datetime.datetime.strptime(filter.endDate, '%m/%d/%Y')

    result = await visualizations.visualizations(startDate=start_time,
                                    endDate=end_time,
                                    requestTypes=filter.requestTypes,
                                    ncList=filter.ncList)
    return result
