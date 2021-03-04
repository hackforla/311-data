from aiocache import cached

from sqlalchemy import and_

from . import db
from .service_request import ServiceRequest
from .region import Region
from .request_type import RequestType


class Council(db.Model):
    __tablename__ = "councils"

    council_id = db.Column(db.SmallInteger, primary_key=True)
    council_name = db.Column(db.String)
    website = db.Column(db.String)
    twitter = db.Column(db.String)
    region_id = db.Column(db.SmallInteger, db.ForeignKey('regions.region_id'))
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    data_code = db.Column(db.SmallInteger)

    @classmethod
    @cached(key="councils:all", alias="default")
    async def all(cls):
        result = await (
            db.select(
                [
                    Council,
                    Region.region_name
                ]
            ).select_from(
                Council.join(Region)
            ).where(
                Council.council_id > 0
            ).gino.all()
        )
        return result

    @classmethod
    async def one(cls, id: int):
        result = await (
            db.select(
                [
                    Council,
                    Region.region_name
                ]
            ).select_from(
                Council.join(Region)
            ).where(
                Council.council_id == id
            ).gino.first()
        )
        return result

    @classmethod
    @cached(alias="default")
    async def get_open_request_counts(cls, council: int):

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


@cached(key="councils:dict", alias="default")
async def get_councils_dict():
    result = await db.all(Council.query)
    councils_dict = [
        (i.council_id, (i.council_name, i.latitude, i.longitude))
        for i in result
    ]
    return dict(councils_dict)
