from typing import List

from aiocache import cached, Cache, serializers

from ..config import CACHE_ENDPOINT
from . import db


class RequestType(db.Model):
    __tablename__ = 'request_types'

    type_id = db.Column(db.SmallInteger, primary_key=True)
    type_name = db.Column(db.String)
    color = db.Column(db.String)


@cached(cache=Cache.REDIS,
        endpoint=CACHE_ENDPOINT,
        namespace="types",
        key="dict",
        serializer=serializers.PickleSerializer(),
        )
async def get_types_dict():
    result = await db.all(RequestType.query)
    types_dict = [(i.type_id, i.type_name) for i in result]
    return dict(types_dict)


async def get_types_by_str_list(str_list: List[str]) -> List[RequestType]:
    '''Get a list of RequestTypes from their type_names'''
    result = await db.all(
        RequestType.query.where(
            RequestType.type_name.in_(str_list)
        )
    )
    return result


async def get_types_by_int_list(int_list: List[int]) -> List[RequestType]:
    '''Get a list of RequestTypes from their type_names'''
    result = await db.all(
        RequestType.query.where(
            RequestType.type_id.in_(int_list)
        )
    )
    return result


@cached(cache=Cache.REDIS,
        endpoint=CACHE_ENDPOINT,
        namespace="types",
        serializer=serializers.PickleSerializer(),
        )
async def get_type_ids_by_str_list(str_list: List[str]) -> List[int]:
    '''Get a list of RequestType IDs from their type_names'''
    result = await db.all(
        RequestType.query.where(
            RequestType.type_name.in_(str_list)
        )
    )
    return [row.type_id for row in result]
