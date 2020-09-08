
from ..models import request_type, council, region
from ..config import cache


async def build_cache():
    if cache.get('types_dict') is None:
        cache['types_dict'] = await request_type.get_types_dict()
    if cache.get('councils_dict') is None:
        cache['councils_dict'] = await council.get_councils_dict()
    if cache.get('regions_dict') is None:
        cache['regions_dict'] = await region.get_regions_dict()
