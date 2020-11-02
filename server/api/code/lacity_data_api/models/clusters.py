from typing import List
import datetime

import numpy
import pysupercluster
from sqlalchemy import and_

from .service_request import ServiceRequest
from .region import Region
from .council import get_councils_dict
from .request_type import get_types_dict
from . import db, cache
from ..config import DEBUG, CACHE_MAX_RETRIES
from ..services import utilities


DEFAULT_CITY_ZOOM = 11  # a click on a city point zooms from 10 to 12
DEFAULT_REGION_ZOOM = 12  # a click on a city point zooms from 10 to 12
DEFAULT_COUNCIL_ZOOM = 13  # a click on a council point zooms to 14
DEFAULT_LATITUDE = 34.0522
DEFAULT_LONGITUDE = -118.2437


class Cluster:
    def __init__(self,
                count: int,
                expansion_zoom: int,
                id: int,
                latitude: float,
                longitude: float):
        self.count = count
        self.expansion_zoom = expansion_zoom
        self.id = id
        self.latitude = latitude
        self.longitude = longitude


async def get_clusters_for_regions(
        start_date: datetime.date,
        end_date: datetime.date,
        type_ids: List[int],
        council_ids: List[int],
        zoom_current: int
) -> List[Cluster]:
    """
    Cluster service request pins by council regions

    Args:
        start_date (date): beginning of date range service was requested
        end_date (date): end of date range service was requested
        type_ids (List[int]): the request type ids to match on
        council_ids (List[int]): the council ids to match on

    Returns:
        cluster: a list of cluster objects
    """

    # TODO: CACHE 'region-reqs:start-end-types-councils'
    result = await (
        db.select(
            [
                ServiceRequest.region_id,
                db.func.count()
            ]
        ).where(
            and_(
                ServiceRequest.created_date >= start_date,
                ServiceRequest.created_date <= end_date,
                ServiceRequest.type_id.in_(type_ids),
                ServiceRequest.council_id.in_(council_ids),
            )
        ).group_by(
            ServiceRequest.region_id
        ).gino.all()
    )

    cluster_list = []

    for row in result:
        region = await Region.get(row[0])
        cluster_list.append(Cluster(
            count=row[1],
            expansion_zoom=DEFAULT_REGION_ZOOM,
            id=region.region_id,
            latitude=region.latitude,
            longitude=region.longitude
        ))

    return cluster_list


async def get_clusters_for_councils(
        start_date: datetime.date,
        end_date: datetime.date,
        type_ids: List[int],
        council_ids: List[int],
        zoom_current: int
) -> List[Cluster]:
    """
    Cluster service request pins by council

    Args:
        start_date (date): beginning of date range service was requested
        end_date (date): end of date range service was requested
        type_ids (List[int]): the request type ids to match on
        council_ids (List[int]): the council ids to match on

    Returns:
        cluster: a list of cluster objects
    """

    # TODO: CACHE 'council-reqs:start-end-types-councils'
    result = await (
        db.select(
            [
                ServiceRequest.council_id,
                db.func.count()
            ]
        ).where(
            and_(
                ServiceRequest.created_date >= start_date,
                ServiceRequest.created_date <= end_date,
                ServiceRequest.type_id.in_(type_ids),
                ServiceRequest.council_id.in_(council_ids),
            )
        ).group_by(
            ServiceRequest.council_id
        ).gino.all()
    )

    # zoom_next = (zoom_current + 1) or DEFAULT_COUNCIL_ZOOM
    cluster_list = []

    # TODO: replace this with a caching solution
    # returns dictionary with council id as key and name, lat, long
    # council_result = await db.all(Council.query)
    # councils = [
    #     (i.council_id, [i.council_name, i.latitude, i.longitude])
    #     for i in council_result
    # ]
    councils_dict = await get_councils_dict()

    for row in result:
        council = councils_dict.get(row[0])
        cluster_list.append(Cluster(
            count=row[1],
            expansion_zoom=DEFAULT_COUNCIL_ZOOM,
            id=row[0],
            latitude=council[1],
            longitude=council[2]
        ))

    return cluster_list


async def get_points(
        start_date: datetime.date,
        end_date: datetime.date,
        type_ids: List[int],
        council_ids: List[int]
) -> List[List[int]]:
    """
    Get filtered geospacial points for service requests for the entire city

    Args:
        start_date (date): beginning of date range service was requested
        end_date (date): end of date range service was requested
        type_ids (List[int]): the request type ids to match
        council_ids: (List[int]): the council ids to match

    Returns:
        a list of latitude and logitude pairs of service request locations
    """

    result = await (
        db.select(
            [
                ServiceRequest.latitude,
                ServiceRequest.longitude
            ]
        ).where(
            and_(
                ServiceRequest.created_date >= start_date,
                ServiceRequest.created_date <= end_date,
                ServiceRequest.type_id.in_(type_ids),
                ServiceRequest.council_id.in_(council_ids)
            )
        ).gino.all()
    )

    return [[row.latitude, row.longitude] for row in result]


async def get_clusters_for_bounds(
        start_date: datetime.date,
        end_date: datetime.date,
        type_ids: List[int],
        council_ids: List[int],
        zoom_current: int,
        bounds
) -> List[Cluster]:
    """
    Cluster pins for the entire city

    Args:
        start_date (date): beginning of date range service was requested
        end_date (date): end of date range service was requested
        type_ids (List[int]): the request type ids to match on

    Returns:
        a JSON object either representing a cluster or a pin for a request
    """

    cache_key = utilities.cache_key(
        "pins",
        {
            "start_date": start_date,
            "end_date": end_date,
            "type_ids": type_ids,
            "council_ids": council_ids
        }
    )

    # Try accessing the result from cache the configured number of times
    for _ in range(CACHE_MAX_RETRIES):
        try:
            result = await cache.get(cache_key)
        except Exception:
            # Output when timeout occurs
            print("Redis get cache timeout error")
            continue
        else:
            break
    else:
        print(f"Redis cache is unavailable after {CACHE_MAX_RETRIES} tries")

    if result is None:
        # query database and set cache entry
        result = await (
            db.select(
                [
                    ServiceRequest.request_id,
                    ServiceRequest.type_id,
                    ServiceRequest.latitude,
                    ServiceRequest.longitude
                ]
            ).where(
                and_(
                    ServiceRequest.created_date >= start_date,
                    ServiceRequest.created_date <= end_date,
                    ServiceRequest.type_id.in_(type_ids),
                    ServiceRequest.council_id.in_(council_ids)
                )
            ).gino.all()
        )
        # Try setting the cache with results. OK if fails.
        try:
            await cache.set(cache_key, result)
        except Exception:
            print("Redis set cache timeout error")
    else:
        if DEBUG:
            print(f"Cache hit for key ({cache_key})")

    return await cluster_points(result, bounds, zoom_current)


async def cluster_points(result, bounds, zoom_current):
    # get points to cluster
    points = [[row.longitude, row.latitude] for row in result]

    index = pysupercluster.SuperCluster(
        numpy.array(points),
        min_zoom=0,
        max_zoom=17,
        radius=200,
        extent=512
    )

    cluster_list = index.getClusters(
        top_left=(bounds.west, bounds.north),
        bottom_right=(bounds.east, bounds.south),
        zoom=zoom_current
    )

    types_dict = await get_types_dict()

    for item in cluster_list:
        # change single item clusters into points
        if item['count'] == 1:
            pin = result[item['id']]  # cluster id matches the result row
            item['srnumber'] = "1-" + str(pin.request_id)
            item['requesttype'] = types_dict[pin.type_id]
            del item['expansion_zoom']

    return cluster_list
