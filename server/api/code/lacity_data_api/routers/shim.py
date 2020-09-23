import datetime

from fastapi import APIRouter, HTTPException

from .api_models import (
    Filter, StatusTypes, Feedback, Comparison
)
from ..models import (
    clusters, request_type, service_request, status
)
from ..config import GITHUB_CODE_VERSION, GITHUB_SHA
from .utilities import build_cache

router = APIRouter()

"""
These are new legacy-compatible router routes. They implement the existing API
methods but get data from the new models using async database queries and cache.
"""


# TODO: separate into own file and add sys
@router.get("/status/{status_type}",
            description="Provides the status of backend systems")
async def shim_status_check(status_type: StatusTypes):
    if status_type == StatusTypes.api:
        return {
            'currentTime': datetime.datetime.now(),
            'gitSha': GITHUB_SHA,
            'version': GITHUB_CODE_VERSION,
            'lastPulled': await status.get_last_updated()
        }

    if status_type == StatusTypes.database:
        return {
            "postgres_version": await status.get_db_version(),
            "alembic_version": await status.get_alembic_version(),
            "last_updated": await status.get_last_updated(),
            "request_types": await status.get_request_types_count(),
            "regions": await status.get_regions_count(),
            "councils": await status.get_councils_count(),
            "service_requests": await status.get_service_requests_count(),
            "requests": await status.get_requests_count()
        }

    if status_type == StatusTypes.cache:
        cache = await build_cache()
        return cache


# TODO: some clean up
@router.get("/servicerequest/{srnumber}")
async def shim_get_service_request(srnumber: str):
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


# TODO: return format is slightly different than current...FIX?
@router.post("/open-requests")
async def shim_get_open_requests():
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
async def shim_get_clusters(filter: Filter):
    # convert type names to type ids
    type_ids = await request_type.get_type_ids_by_str_list(filter.requestTypes)

    result = await clusters.get_clusters_for_bounds(
        filter.startDate,
        filter.endDate,
        type_ids,
        filter.ncList,
        filter.zoom,
        filter.bounds
    )
    if result == []:
        raise HTTPException(status_code=429, detail="Too many requests")

    return result


@router.post("/map/heat")
async def shim_get_heatmap(filter: Filter):
    # convert type names to type ids
    type_ids = await request_type.get_type_ids_by_str_list(filter.requestTypes)

    result = await clusters.get_points(
        filter.startDate,
        filter.endDate,
        type_ids,
        filter.ncList
    )
    return result


# TODO: PLACEHOLDER
@router.post("/map/pins")
async def shim_get_pins(filter: Filter):
    return [
        {
            "srnumber": "1-1597411711",
            "requesttype": "Single Streetlight Issue",
            "latitude": 33.9547572,
            "longitude": -118.39466885
        },
        {
            "srnumber": "1-1597412651",
            "requesttype": "Single Streetlight Issue",
            "latitude": 33.95474831,
            "longitude": -118.39326973
        },
        {
            "srnumber": "1-1597418591",
            "requesttype": "Homeless Encampment",
            "latitude": 34.1015964889,
            "longitude": -118.323675347
        },
        {
            "srnumber": "1-1597533121",
            "requesttype": "Graffiti Removal",
            "latitude": 34.0248294082,
            "longitude": -118.202687279
        },
        {
            "srnumber": "1-1597535051",
            "requesttype": "Graffiti Removal",
            "latitude": 34.0244950305,
            "longitude": -118.202230826
        }
    ]


# TODO: PLACEHOLDER
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


# TODO: PLACEHOLDER
@router.post("/comparison/frequency")
async def get_comparison_frequency(comp_filter: Comparison):
    return {
        "bins": [
            "2020-01-01",
            "2020-01-23",
            "2020-02-14",
            "2020-03-07",
            "2020-03-29",
            "2020-04-20",
            "2020-05-12",
            "2020-06-03",
            "2020-06-25",
            "2020-07-17",
            "2020-08-08",
            "2020-08-30",
            "2020-09-21",
            "2020-10-13"
        ],
        "set1": {
            "district": "nc",
            "counts": {
                "5": [
                    28,
                    25,
                    35,
                    22,
                    32,
                    48,
                    45,
                    42,
                    40,
                    44,
                    41,
                    13,
                    0
                ],
                "6": [
                    22,
                    33,
                    18,
                    21,
                    24,
                    21,
                    22,
                    17,
                    21,
                    23,
                    27,
                    8,
                    0
                ],
                "7": [
                    28,
                    40,
                    22,
                    25,
                    20,
                    27,
                    24,
                    35,
                    33,
                    41,
                    29,
                    7,
                    0
                ],
                "8": [
                    20,
                    26,
                    21,
                    19,
                    16,
                    20,
                    23,
                    15,
                    13,
                    12,
                    33,
                    9,
                    0
                ],
                "9": [
                    13,
                    17,
                    8,
                    15,
                    18,
                    18,
                    16,
                    11,
                    20,
                    18,
                    27,
                    12,
                    0
                ],
                "10": [
                    10,
                    13,
                    7,
                    10,
                    17,
                    13,
                    10,
                    20,
                    13,
                    25,
                    13,
                    11,
                    0
                ],
                "100": [
                    24,
                    16,
                    26,
                    15,
                    13,
                    24,
                    30,
                    17,
                    22,
                    24,
                    15,
                    7,
                    0
                ],
                "101": [
                    8,
                    11,
                    16,
                    20,
                    8,
                    13,
                    6,
                    19,
                    14,
                    19,
                    19,
                    5,
                    0
                ],
                "112": [
                    15,
                    8,
                    10,
                    8,
                    7,
                    9,
                    10,
                    8,
                    7,
                    14,
                    3,
                    3,
                    0
                ]
            }
        },
        "set2": {
            "district": "nc",
            "counts": {
                "4": [
                    13,
                    14,
                    15,
                    12,
                    9,
                    17,
                    11,
                    11,
                    26,
                    10,
                    11,
                    4,
                    0
                ],
                "99": [
                    46,
                    27,
                    28,
                    29,
                    28,
                    24,
                    24,
                    28,
                    28,
                    41,
                    35,
                    10,
                    0
                ],
                "111": [
                    10,
                    9,
                    5,
                    7,
                    14,
                    19,
                    6,
                    14,
                    11,
                    14,
                    9,
                    3,
                    0
                ],
                "113": [
                    18,
                    13,
                    7,
                    13,
                    15,
                    12,
                    19,
                    13,
                    12,
                    12,
                    12,
                    3,
                    0
                ],
                "114": [
                    9,
                    8,
                    6,
                    2,
                    10,
                    14,
                    9,
                    9,
                    8,
                    11,
                    12,
                    2,
                    0
                ],
                "118": [
                    24,
                    27,
                    13,
                    15,
                    30,
                    24,
                    23,
                    19,
                    19,
                    29,
                    17,
                    13,
                    0
                ],
                "120": [
                    16,
                    23,
                    12,
                    11,
                    9,
                    15,
                    12,
                    9,
                    4,
                    10,
                    13,
                    4,
                    0
                ],
                "124": [
                    18,
                    18,
                    18,
                    9,
                    17,
                    19,
                    22,
                    32,
                    10,
                    21,
                    20,
                    3,
                    0
                ]
            }
        }
    }


# TODO: PLACEHOLDER
@router.post("/comparison/timetoclose")
async def get_comparison_time_to_close(comp_filter: Comparison):
    return {
        "set1": {
            "district": "nc",
            "data": {
                "5": {
                    "min": 0.00147,
                    "q1": 0.047558,
                    "median": 0.124306,
                    "q3": 0.701979,
                    "max": 1.935417,
                    "whiskerMin": 0.00147,
                    "whiskerMax": 1.596528,
                    "count": 413,
                    "outlierCount": 5
                },
                "6": {
                    "min": 0.001632,
                    "q1": 0.043591,
                    "median": 0.125625,
                    "q3": 0.69532975,
                    "max": 2.700694,
                    "whiskerMin": 0.001632,
                    "whiskerMax": 1.03765,
                    "count": 256,
                    "outlierCount": 2
                },
                "7": {
                    "min": 0.002083,
                    "q1": 0.043125,
                    "median": 0.1075,
                    "q3": 0.648611,
                    "max": 1.061725,
                    "whiskerMin": 0.002083,
                    "whiskerMax": 1.061725,
                    "count": 329,
                    "outlierCount": 0
                },
                "8": {
                    "min": 0.003738,
                    "q1": 0.050833,
                    "median": 0.114699,
                    "q3": 0.597593,
                    "max": 2.657639,
                    "whiskerMin": 0.003738,
                    "whiskerMax": 1.057778,
                    "count": 225,
                    "outlierCount": 2
                },
                "9": {
                    "min": 0.002604,
                    "q1": 0.041554,
                    "median": 0.1044505,
                    "q3": 0.66812475,
                    "max": 0.983762,
                    "whiskerMin": 0.002604,
                    "whiskerMax": 0.983762,
                    "count": 190,
                    "outlierCount": 0
                },
                "10": {
                    "min": 0.006956,
                    "q1": 0.064346,
                    "median": 0.113368,
                    "q3": 0.581024,
                    "max": 0.891644,
                    "whiskerMin": 0.006956,
                    "whiskerMax": 0.891644,
                    "count": 159,
                    "outlierCount": 0
                },
                "100": {
                    "min": 0.001887,
                    "q1": 0.0461805,
                    "median": 0.122801,
                    "q3": 0.6788425,
                    "max": 2.858333,
                    "whiskerMin": 0.001887,
                    "whiskerMax": 1.40081,
                    "count": 231,
                    "outlierCount": 1
                },
                "101": {
                    "min": 0.007847,
                    "q1": 0.0443895,
                    "median": 0.1252085,
                    "q3": 0.63987825,
                    "max": 1.003542,
                    "whiskerMin": 0.007847,
                    "whiskerMax": 1.003542,
                    "count": 158,
                    "outlierCount": 0
                },
                "112": {
                    "min": 0.005463,
                    "q1": 0.078547,
                    "median": 0.174572,
                    "q3": 0.70704275,
                    "max": 1.073461,
                    "whiskerMin": 0.005463,
                    "whiskerMax": 1.073461,
                    "count": 102,
                    "outlierCount": 0
                }
            }
        },
        "set2": {
            "district": "nc",
            "data": {
                "4": {
                    "min": 0.001354,
                    "q1": 0.074942,
                    "median": 0.198889,
                    "q3": 0.802465,
                    "max": 2.907639,
                    "whiskerMin": 0.001354,
                    "whiskerMax": 1.829491,
                    "count": 149,
                    "outlierCount": 1
                },
                "99": {
                    "min": 0.001007,
                    "q1": 0.063889,
                    "median": 0.207303,
                    "q3": 0.79066,
                    "max": 2.984479,
                    "whiskerMin": 0.001007,
                    "whiskerMax": 1.781898,
                    "count": 343,
                    "outlierCount": 3
                },
                "111": {
                    "min": 0.001794,
                    "q1": 0.059282,
                    "median": 0.149861,
                    "q3": 0.825046,
                    "max": 1.588507,
                    "whiskerMin": 0.001794,
                    "whiskerMax": 1.588507,
                    "count": 121,
                    "outlierCount": 0
                },
                "113": {
                    "min": 0.006481,
                    "q1": 0.07822625,
                    "median": 0.5171295,
                    "q3": 0.7923905,
                    "max": 3.473611,
                    "whiskerMin": 0.006481,
                    "whiskerMax": 1.112234,
                    "count": 148,
                    "outlierCount": 4
                },
                "114": {
                    "min": 0.003657,
                    "q1": 0.057824,
                    "median": 0.161944,
                    "q3": 0.7885015,
                    "max": 2.90588,
                    "whiskerMin": 0.003657,
                    "whiskerMax": 1.599792,
                    "count": 99,
                    "outlierCount": 2
                },
                "118": {
                    "min": 0.002905,
                    "q1": 0.100822,
                    "median": 0.191308,
                    "q3": 0.823102,
                    "max": 2.604861,
                    "whiskerMin": 0.002905,
                    "whiskerMax": 1.903472,
                    "count": 249,
                    "outlierCount": 4
                },
                "120": {
                    "min": 0.008264,
                    "q1": 0.0700175,
                    "median": 0.212141,
                    "q3": 0.7545775,
                    "max": 1.737095,
                    "whiskerMin": 0.008264,
                    "whiskerMax": 1.737095,
                    "count": 135,
                    "outlierCount": 0
                },
                "124": {
                    "min": 0.004838,
                    "q1": 0.06111975,
                    "median": 0.233154,
                    "q3": 0.73782425,
                    "max": 2.888889,
                    "whiskerMin": 0.004838,
                    "whiskerMax": 1.511157,
                    "count": 206,
                    "outlierCount": 3
                }
            }
        }
    }


# TODO: PLACEHOLDER
@router.post("/comparison/counts")
async def get_comparison_counts(comp_filter: Comparison):
    return {
        "bins": [
            "2020-01-01",
            "2020-01-23",
            "2020-02-14",
            "2020-03-07",
            "2020-03-29",
            "2020-04-20",
            "2020-05-12",
            "2020-06-03",
            "2020-06-25",
            "2020-07-17",
            "2020-08-08",
            "2020-08-30",
            "2020-09-21",
            "2020-10-13"
        ],
        "set1": {
            "district": "nc",
            "counts": {
                "5": [
                    28,
                    25,
                    35,
                    22,
                    32,
                    48,
                    45,
                    42,
                    40,
                    44,
                    41,
                    13,
                    0
                ],
                "6": [
                    22,
                    33,
                    18,
                    21,
                    24,
                    21,
                    22,
                    17,
                    21,
                    23,
                    27,
                    8,
                    0
                ],
                "7": [
                    28,
                    40,
                    22,
                    25,
                    20,
                    27,
                    24,
                    35,
                    33,
                    41,
                    29,
                    7,
                    0
                ],
                "8": [
                    20,
                    26,
                    21,
                    19,
                    16,
                    20,
                    23,
                    15,
                    13,
                    12,
                    33,
                    9,
                    0
                ],
                "9": [
                    13,
                    17,
                    8,
                    15,
                    18,
                    18,
                    16,
                    11,
                    20,
                    18,
                    27,
                    12,
                    0
                ],
                "10": [
                    10,
                    13,
                    7,
                    10,
                    17,
                    13,
                    10,
                    20,
                    13,
                    25,
                    13,
                    11,
                    0
                ],
                "100": [
                    24,
                    16,
                    26,
                    15,
                    13,
                    24,
                    30,
                    17,
                    22,
                    24,
                    15,
                    7,
                    0
                ],
                "101": [
                    8,
                    11,
                    16,
                    20,
                    8,
                    13,
                    6,
                    19,
                    14,
                    19,
                    19,
                    5,
                    0
                ],
                "112": [
                    15,
                    8,
                    10,
                    8,
                    7,
                    9,
                    10,
                    8,
                    7,
                    14,
                    3,
                    3,
                    0
                ]
            }
        },
        "set2": {
            "district": "nc",
            "counts": {
                "4": [
                    13,
                    14,
                    15,
                    12,
                    9,
                    17,
                    11,
                    11,
                    26,
                    10,
                    11,
                    4,
                    0
                ],
                "99": [
                    46,
                    27,
                    28,
                    29,
                    28,
                    24,
                    24,
                    28,
                    28,
                    41,
                    35,
                    10,
                    0
                ],
                "111": [
                    10,
                    9,
                    5,
                    7,
                    14,
                    19,
                    6,
                    14,
                    11,
                    14,
                    9,
                    3,
                    0
                ],
                "113": [
                    18,
                    13,
                    7,
                    13,
                    15,
                    12,
                    19,
                    13,
                    12,
                    12,
                    12,
                    3,
                    0
                ],
                "114": [
                    9,
                    8,
                    6,
                    2,
                    10,
                    14,
                    9,
                    9,
                    8,
                    11,
                    12,
                    2,
                    0
                ],
                "118": [
                    24,
                    27,
                    13,
                    15,
                    30,
                    24,
                    23,
                    19,
                    19,
                    29,
                    17,
                    13,
                    0
                ],
                "120": [
                    16,
                    23,
                    12,
                    11,
                    9,
                    15,
                    12,
                    9,
                    4,
                    10,
                    13,
                    4,
                    0
                ],
                "124": [
                    18,
                    18,
                    18,
                    9,
                    17,
                    19,
                    22,
                    32,
                    10,
                    21,
                    20,
                    3,
                    0
                ]
            }
        }
    }


# TODO: PLACEHOLDER
@router.post("/feedback")
async def get_feedback(feedback: Feedback):
    return {'success': True}


# class SimpleServiceRequest(BaseModel):
#     request_id: int
#     type_id: int
#     latitude: float
#     longitude: float

#     class Config:
#         orm_mode = True

# # TODO: tries clustering by district and NC first
# @router.post("/new/clusters")
# async def shim_get_clusters(filter: Filter):
#     # have to convert the funky date formats
#     start_date = datetime.datetime.strptime(filter.startDate, '%m/%d/%Y')
#     end_date = datetime.datetime.strptime(filter.endDate, '%m/%d/%Y')

#     # convert type names to type ids
#     request_types = await request_type.get_types_by_str_list(filter.requestTypes)
#     type_ids = [i.type_id for i in request_types]

#     zoom = filter.zoom or 10

#     if zoom < 12:
#         # get region clusters
#         result = await clusters.get_clusters_for_regions(
#             start_date,
#             end_date,
#             type_ids,
#             filter.ncList,
#             filter.zoom
#         )
#     elif zoom < 14:
#         # get council clusters
#         result = await clusters.get_clusters_for_councils(
#             start_date,
#             end_date,
#             type_ids,
#             filter.ncList,
#             filter.zoom
#         )
#     else:
#         # use pysupercluster to cluster viewing area
#         result = await clusters.get_clusters_for_bounds(
#             start_date,
#             end_date,
#             type_ids,
#             filter.ncList,
#             filter.zoom,
#             filter.bounds
#         )

#     return result
