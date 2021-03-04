from typing import List

from aiocache import cached
from . import db


class RequestType(db.Model):
    __tablename__ = 'request_types'

    type_id = db.Column(db.SmallInteger, primary_key=True)
    type_name = db.Column(db.String)
    agency_id = db.Column(db.SmallInteger, db.ForeignKey('agencies.agency_id'))
    color = db.Column(db.String)
    description = db.Column(db.String)
    data_code = db.Column(db.String)

    @classmethod
    @cached(key="types:all", alias="default")
    async def all(cls):
        from .agency import Agency

        result = await (
            db.select(
                [
                    RequestType,
                    Agency.agency_name
                ]
            ).select_from(
                RequestType.join(Agency, isouter=True)
            ).order_by(
                RequestType.agency_id.desc(), RequestType.type_id
            ).gino.all()
        )
        return result

    @classmethod
    async def one(cls, id: int):
        from .agency import Agency

        result = await (
            db.select(
                [
                    RequestType,
                    Agency.agency_name
                ]
            ).select_from(
                RequestType.join(Agency, isouter=True)
            ).where(
                RequestType.type_id == id
            ).gino.first()
        )
        return result

    @classmethod
    @cached(key="types:stats", alias="default")
    async def get_type_stats(cls):

        query = db.text("""
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
            WHERE
                service_requests.closed_date <= CURRENT_DATE AND
                service_requests.closed_date >= service_requests.created_date
            GROUP BY
                service_requests.type_id, request_types.type_name
        """)

        result = await db.all(query)
        return result


@cached(key="types:dict", alias="default")
async def get_types_dict():
    '''This is a shim function to allow types to be retrieved by strings'''
    result = await db.all(RequestType.query)
    types_dict = [(i.type_id, i.data_code) for i in result]
    return dict(types_dict)


async def get_type_ids_by_str_list(str_list: List[str]) -> List[int]:
    '''Get a list of RequestType IDs from their type_names using data code'''
    result = await db.all(
        RequestType.query.where(
            RequestType.data_code.in_(str_list)
        )
    )
    return [row.type_id for row in result]
