from fastapi import responses
from fastapi import APIRouter

from .api_models import (
    StatusTypes, Filter, Pins, Comparison, Feedback
)
from services import (
    status, map, visualizations, requests, comparison, github, email
)

router = APIRouter()

"""
These are router classes that implement the existing API design and
use the legacy services code from src as-is.
"""


@router.get("/status/{status_type}",
            description="Provides the status of backend systems")
async def status_check(status_type: StatusTypes):
    if status_type == StatusTypes.api:
        result = await status.api()

    if status_type == StatusTypes.database:
        result = await status.database()

    if status_type == StatusTypes.system:
        result = await status.system()

    return result


@router.get("/servicerequest/{srnumber}")
async def get_service_request_by_string(srnumber: str):
    result = requests.item_query(srnumber)
    # TODO: clean this up with 3.8 syntax
    # convert createddate and closeddate to epochs for app compatibility
    if (result['createddate']):
        result['createddate'] = int(result['createddate'].strftime('%s'))
    if (result['closeddate']):
        result['closeddate'] = int(result['closeddate'].strftime('%s'))
    if (result['updateddate']):
        result['updateddate'] = int(result['updateddate'].strftime('%s'))
    if (result['servicedate']):
        result['servicedate'] = int(result['servicedate'].strftime('%s'))
    return result


@router.post("/open-requests")
async def get_open_requests():
    result = await requests.open_requests()
    return result


# NOTE: can't apply response filter here since it sometimes returns a single point
@router.post("/map/clusters")
async def get_clusters(filter: Filter):
    result = await map.pin_clusters(
        filter.startDate,
        filter.endDate,
        filter.requestTypes,
        filter.ncList,
        filter.zoom,
        dict(filter.bounds)
    )
    return result


@router.post("/map/heat")
async def get_heatmap(filter: Filter):
    result = await map.heatmap(
        startDate=filter.startDate,
        endDate=filter.endDate,
        requestTypes=filter.requestTypes,
        ncList=filter.ncList
    )
    return responses.JSONResponse(result.tolist())


@router.post("/map/pins", response_model=Pins)
async def get_pins(filter: Filter):
    result = await map.pins(
        startDate=filter.startDate,
        endDate=filter.endDate,
        requestTypes=filter.requestTypes,
        ncList=filter.ncList
    )
    return result


@router.post("/visualizations")
async def get_visualizations(filter: Filter):
    result = await visualizations.visualizations(
        startDate=filter.startDate,
        endDate=filter.endDate,
        requestTypes=filter.requestTypes,
        ncList=filter.ncList
    )
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
