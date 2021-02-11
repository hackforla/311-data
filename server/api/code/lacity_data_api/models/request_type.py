from typing import List

from aiocache import cached, Cache, serializers

from ..config import CACHE_ENDPOINT
from . import db


class RequestType(db.Model):
    __tablename__ = 'request_types'

    type_id = db.Column(db.SmallInteger, primary_key=True)
    type_name = db.Column(db.String)
    color = db.Column(db.String)
    data_code = db.Column(db.String)

    @classmethod
    @cached(cache=Cache.REDIS,
            endpoint=CACHE_ENDPOINT,
            namespace="types",
            key="stats",
            serializer=serializers.PickleSerializer(),
            )
    async def get_type_stats(cls):

        query = db.text("""
            SELECT
                service_requests.type_id,
                request_types.type_name,
                min(closed_date - created_date),
                percentile_disc(0.25) within group
                    (order by closed_date - created_date) as q1,
                percentile_disc(0.5) within group
                    (order by closed_date - created_date) as median,
                percentile_disc(0.75) within group
                    (order by closed_date - created_date) as q3,
                max(closed_date - created_date)
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


@cached(cache=Cache.REDIS,
        endpoint=CACHE_ENDPOINT,
        namespace="types",
        key="dict",
        serializer=serializers.PickleSerializer(),
        )
async def get_types_dict():
    '''This is a shim function to allow types to be retrieved by strings'''
    result = await db.all(RequestType.query)
    types_dict = [(i.type_id, i.data_code) for i in result]
    return dict(types_dict)


@cached(cache=Cache.REDIS,
        endpoint=CACHE_ENDPOINT,
        namespace="types",
        serializer=serializers.PickleSerializer(),
        )
async def get_type_ids_by_str_list(str_list: List[str]) -> List[int]:
    '''Get a list of RequestType IDs from their type_names using data code'''
    result = await db.all(
        RequestType.query.where(
            RequestType.data_code.in_(str_list)
        )
    )
    return [row.type_id for row in result]
