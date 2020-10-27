import json
import hashlib

from ..models import (
    request_type, council, region, service_request
)


async def build_cache():
    open_requests = await service_request.get_open_requests()
    open_requests_counts = await service_request.get_open_request_counts()
    regions = await region.get_regions_dict()
    councils = await council.get_councils_dict()
    types = await request_type.get_types_dict()

    return {
        "open_requests": len(open_requests),
        "open_requests_counts": len(open_requests_counts),
        "types": len(types),
        "councils": len(councils),
        "regions": len(regions)
    }


def cache_key(category, object):
    """
    Utility function to create hashed key for pins based on filters
    """
    object_json = json.dumps(str(object), sort_keys=True).encode('utf-8')
    hashed_json = hashlib.md5(object_json).hexdigest()
    return f"{category}:{format(hashed_json)}"
