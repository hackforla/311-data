from aiocache import cached

from sqlalchemy import and_

from . import db
from .service_request import ServiceRequest
from .region import Region
from .request_type import RequestType
from ..services import utilities


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
    @cached(key="Council.all", alias="default")
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
    @cached(key_builder=utilities.classmethod_cache_key, alias="default")
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
    @cached(key_builder=utilities.classmethod_cache_key, alias="default")
    async def get_open_request_counts(cls, council_id: int):

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
                    ServiceRequest.council_id == council_id  # noqa
                )
            ).group_by(
                ServiceRequest.type_id,
                RequestType.type_name
            ).gino.all()
        )
        return result

    @classmethod
    @cached(key="Council.all_type_stats", alias="default")
    async def get_all_type_stats(cls):

        query = db.text("""
            SELECT
                service_requests.council_id,
                service_requests.type_id,
                request_types.type_name,
                min(closed_date::date - created_date::date),
                percentile_disc(0.25) within group
                    (order by closed_date::date - created_date::date) as q1,
                percentile_disc(0.5) within group
                    (order by closed_date::date - created_date::date) as median,
                percentile_disc(0.75) within group
                    (order by closed_date::date - created_date::date) as q3,
                max(closed_date::date - created_date::date)
            FROM
                service_requests
            JOIN
                request_types ON request_types.type_id = service_requests.type_id
            JOIN
                councils ON councils.council_id = service_requests.council_id
            WHERE
                service_requests.closed_date <= CURRENT_DATE AND
                service_requests.closed_date >= service_requests.created_date
            GROUP BY
                service_requests.council_id,
                service_requests.type_id,
                request_types.type_name
        """)

        result = await db.all(query)
        return result

    @classmethod
    @cached(key_builder=utilities.classmethod_cache_key, alias="default")
    async def get_type_stats(cls, council_id: int):

        query = db.text(f"""
            SELECT
                service_requests.type_id,
                request_types.type_name,
                min(closed_date::date - created_date::date),
                percentile_disc(0.25) within group
                    (order by closed_date::date - created_date::date) as q1,
                percentile_disc(0.5) within group
                    (order by closed_date::date - created_date::date) as median,
                percentile_disc(0.75) within group
                    (order by closed_date::date - created_date::date) as q3,
                max(closed_date::date - created_date::date)
            FROM
                service_requests
            JOIN
                request_types ON request_types.type_id = service_requests.type_id
            JOIN
                councils ON councils.council_id = service_requests.council_id
            WHERE
                service_requests.council_id = { council_id } AND
                service_requests.closed_date <= CURRENT_DATE AND
                service_requests.closed_date >= service_requests.created_date
            GROUP BY
                service_requests.type_id, request_types.type_name
        """)

        result = await db.all(query)
        return result


@cached(key="Council.dict", alias="default")
async def get_councils_dict():
    result = await db.all(Council.query)
    councils_dict = [
        (i.council_id, (i.council_name, i.latitude, i.longitude))
        for i in result
    ]
    return dict(councils_dict)
