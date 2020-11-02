from aiocache import cached, Cache, serializers

from sqlalchemy import and_

from . import db
from .service_request import ServiceRequest
from .request_type import RequestType
from ..config import CACHE_ENDPOINT


class Council(db.Model):
    __tablename__ = "councils"

    council_id = db.Column(db.SmallInteger, primary_key=True)
    council_name = db.Column(db.String)
    region_id = db.Column(db.SmallInteger)
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)


@cached(cache=Cache.REDIS,
        endpoint=CACHE_ENDPOINT,
        namespace="councils",
        key="dict",
        serializer=serializers.PickleSerializer(),
        )
async def get_councils_dict():
    result = await db.all(Council.query)
    councils_dict = [
        (i.council_id, (i.council_name, i.latitude, i.longitude))
        for i in result
    ]
    return dict(councils_dict)


@cached(cache=Cache.REDIS,
        endpoint=CACHE_ENDPOINT,
        namespace="councils",
        serializer=serializers.PickleSerializer(),
        )
async def get_open_request_counts(council: int):

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
                ServiceRequest.council_id == council  # noqa
            )
        ).group_by(
            ServiceRequest.type_id,
            RequestType.type_name
        ).gino.all()
    )
    return result
