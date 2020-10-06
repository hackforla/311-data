import json
import hashlib

from ..models import request_type, council, region


async def build_cache():
    types = await request_type.get_types_dict()
    councils = await council.get_councils_dict()
    regions = await region.get_regions_dict()

    return {
        "types": types,
        "councils": councils,
        "regions": regions
    }


def cache_key(category, object):
    """
    Utility function to create hashed key for pins based on filters
    """
    object_json = json.dumps(str(object), sort_keys=True).encode('utf-8')
    hashed_json = hashlib.md5(object_json).hexdigest()
    return f"{category}:{format(hashed_json)}"
