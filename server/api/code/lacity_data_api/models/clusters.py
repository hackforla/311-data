from typing import List
import datetime

import numpy
import pysupercluster
from sqlalchemy import and_

from .service_request import ServiceRequest
from .request_type import get_types_dict
from .council import Council
from . import db


DEFAULT_CITY_ZOOM = 12  # a click on a city point zooms from 10 to 12
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


async def get_clusters_for_city(
        start_date: datetime.date,
        end_date: datetime.date,
        type_ids: List[int],
        zoom_current: int
) -> List[Cluster]:
    """
    Cluster pins for the entire city

    Args:
        start_date (date): beginning of date range service was requested
        end_date (date): end of date range service was requested
        type_ids (List[int]): the request type ids to match on

    Returns:
        cluster: a cluster object
    """

    result = await (db.select([db.func.count()])
        .where(and_(
            ServiceRequest.created_date >= start_date,
            ServiceRequest.created_date <= end_date,
            ServiceRequest.type_id.in_(type_ids)
        ))
    ).gino.scalar()

    # zoom_next = (zoom_current + 1) or DEFAULT_CITY_ZOOM

    cluster_list = []
    cluster_list.append(Cluster(
        count=result,
        expansion_zoom=DEFAULT_CITY_ZOOM,
        id=0,
        latitude=DEFAULT_LATITUDE,
        longitude=DEFAULT_LONGITUDE
    ))

    return cluster_list


# TODO: same as above by group by region of each council
def get_clusters_for_regions(pins, zoom, bounds, options):
    """
    Cluster pins by region
    """
    print(zoom)


# TODO: same as above by group by council
async def get_clusters_for_councils(
        start_date: datetime.date,
        end_date: datetime.date,
        type_ids: List[int],
        council_ids: List[int],
        zoom_current: int
) -> List[Cluster]:
    """
    Cluster pins for the entire city

    Args:
        start_date (date): beginning of date range service was requested
        end_date (date): end of date range service was requested
        type_ids (List[int]): the request type ids to match on

    Returns:
        cluster: a cluster object
    """

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

    for row in result:
        council = await Council.get(row[0])
        cluster_list.append(Cluster(
            count=row[1],
            expansion_zoom=DEFAULT_COUNCIL_ZOOM,
            id=council.council_id,
            latitude=council.latitude,
            longitude=council.longitude
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
        a list of latitude and logitude pairs of service locations
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

    point_list = []
    for row in result:
        point_list.append([row[0], row[1]])

    return point_list


# TODO: same as above by group by council
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

    result = await (
        db.select(
            [
                ServiceRequest.request_id,
                ServiceRequest.latitude,
                ServiceRequest.longitude,
                ServiceRequest.type_id
            ]
        ).where(
            and_(
                ServiceRequest.created_date >= start_date,
                ServiceRequest.created_date <= end_date,
                ServiceRequest.type_id.in_(type_ids),
                ServiceRequest.council_id.in_(council_ids),
                ServiceRequest.latitude < bounds.north,
                ServiceRequest.latitude > bounds.south,
                ServiceRequest.longitude > bounds.west,
                ServiceRequest.longitude < bounds.east
            )
        ).gino.all()
    )

    # TODO: clean this up. goes in [longitude, latitude] format
    points = [[i[2], i[1]] for i in result]

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
            item['srnumber'] = "1-" + str(pin[0])
            item['requesttype'] = types_dict[pin[3]]
            del item['expansion_zoom']

    return cluster_list
