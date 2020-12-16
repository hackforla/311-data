from fastapi import APIRouter, status

from ..models.schemas import (
    Filter, Feedback, Comparison
)
from ..models import (
    clusters, request_type, service_request, council
)
from ..services import (
    email, github, reports
)

router = APIRouter()

"""
These are new legacy-compatible router routes. They implement the existing API
methods but get data from the new models using async database queries and cache.
"""


@router.get("/servicerequest/{srnumber}")
async def get_service_request(srnumber: str):
    query_result = await service_request.get_full_request(srnumber)

    result = dict(query_result)

    # TODO: should lambda this...
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
    result = await service_request.get_open_requests()

    requests_list = []
    types_dict = await request_type.get_types_dict()
    for i in result:
        requests_list.append({
            'srnumber': i.srnumber,
            'requesttype': types_dict.get(i.type_id),
            'latitude': i.latitude,
            'longitude': i.longitude
        })

    council_data = {}
    for item in await council.get_councils_dict():
        result = await council.get_open_request_counts(item)
        dict((row.type_name, row.type_count) for row in result)
        council_data[item] = dict((row.type_name, row.type_count) for row in result)  # noqa

    return {
        "counts": {
            "nc": council_data
        },
        "requests": requests_list
    }


@router.post("/map/heat")
async def get_heatmap(filter: Filter):
    # convert type names to type ids
    type_ids = await request_type.get_type_ids_by_str_list(filter.requestTypes)

    result = await clusters.get_points(
        filter.startDate,
        filter.endDate,
        type_ids,
        filter.ncList
    )
    return result


@router.post("/map/pins")
async def get_pins(filter: Filter):
    # convert type names to type ids
    type_ids = await request_type.get_type_ids_by_str_list(filter.requestTypes)

    result = await service_request.get_filtered_requests(
        filter.startDate,
        filter.endDate,
        type_ids,
        filter.ncList
    )

    requests_list = []
    types_dict = await request_type.get_types_dict()
    for i in result:
        requests_list.append({
            'srnumber': i.srnumber,
            'requesttype': types_dict.get(i.type_id),
            'latitude': i.latitude,
            'longitude': i.longitude
        })

    return requests_list


@router.post("/visualizations")
async def get_visualizations(filter: Filter):
    result = await reports.get_visualization(
        filter.startDate,
        filter.endDate,
        filter.requestTypes,
        filter.ncList
    )
    return result


@router.post("/comparison/frequency")
async def get_comparison_frequency(comp_filter: Comparison):
    result = await reports.freq_comparison(**dict(comp_filter))
    return result


@router.post("/comparison/timetoclose")
async def get_comparison_time_to_close(comp_filter: Comparison):
    result = await reports.ttc_comparison(**dict(comp_filter))
    return result


@router.post("/comparison/counts")
async def get_comparison_counts(comp_filter: Comparison):
    result = await reports.counts_comparison(**dict(comp_filter))
    return result


@router.post("/feedback", status_code=status.HTTP_201_CREATED)
async def send_feedback(feedback: Feedback):

    id, number = await github.create_issue(feedback.title, feedback.body)
    await github.add_issue_to_project(id)
    await email.respond_to_feedback(feedback.body, number)

    return {
        'success': True
    }
