import datetime
from typing import List

from aiocache import cached, Cache, serializers
from sqlalchemy import and_

from . import db
from .request_type import RequestType
from ..config import CACHE_ENDPOINT
from ..services import utilities


class ServiceRequest(db.Model):
    __tablename__ = 'service_requests'

    request_id = db.Column(db.Integer, primary_key=True)
    srnumber = db.Column(db.String, unique=True)
    created_date = db.Column(db.Date)
    closed_date = db.Column(db.Date)
    type_id = db.Column(db.SmallInteger, db.ForeignKey('request_types.type_id'))
    council_id = db.Column(db.SmallInteger)
    region_id = db.Column(db.SmallInteger)
    address = db.Column(db.String)
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)


async def get_full_request(srnumber: str):
    # query the request table to get full record
    query = db.text("SELECT * FROM requests WHERE srnumber = :num")
    result = await db.first(query, num=srnumber)
    return result


@cached(cache=Cache.MEMORY,
        # endpoint=CACHE_ENDPOINT,
        namespace="open",
        serializer=serializers.NullSerializer(),
        )
async def get_open_requests() -> List[ServiceRequest]:
    result = await (
        db.select(
            [
                ServiceRequest.request_id,
                ServiceRequest.srnumber,
                ServiceRequest.type_id,
                ServiceRequest.latitude,
                ServiceRequest.longitude
            ]
        ).where(
            ServiceRequest.closed_date == None  # noqa
        ).gino.all()
    )
    return result


@cached(cache=Cache.REDIS,
        endpoint=CACHE_ENDPOINT,
        namespace="filtered",
        serializer=serializers.PickleSerializer(),
        key_builder=utilities.cache_key
        )
async def get_filtered_requests(
        start_date: datetime.date,
        end_date: datetime.date,
        type_ids: List[int],
        council_ids: List[int]
):
    result = await (
        db.select(
            [
                ServiceRequest.request_id,
                ServiceRequest.srnumber,
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
    return result


@cached(cache=Cache.REDIS,
        endpoint=CACHE_ENDPOINT,
        namespace="open",
        serializer=serializers.PickleSerializer(),
        )
async def get_open_request_counts():
    result = await (
        db.select(
            [
                ServiceRequest.type_id,
                RequestType.type_name,
                db.func.count().label("type_count")
            ]
        ).select_from(
            ServiceRequest.join(RequestType)
        ).where(
            and_(
                ServiceRequest.closed_date == None,  # noqa
            )
        ).group_by(
            ServiceRequest.type_id,
            RequestType.type_name
        ).gino.all()
    )
    return result
