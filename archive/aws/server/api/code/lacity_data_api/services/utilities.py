import os
from datetime import date, timedelta
from ..config import DATA_DIR
from ..models import (
    request_type, council, region, service_request
)

GET_FILTERED_REQUESTS_LIMIT = 10000


async def build_cache():
    """Builds the cache by calling the set of functions we want cached.

    Returns:
        A dict mapping cache entry string names to their counts.
    """
    from ..models.geometry import Geometry  # avoiding circular imports

    open_requests = await service_request.get_open_requests()
    open_requests_counts = await service_request.get_open_request_counts()
    regions = await region.get_regions_dict()
    councils = await council.get_councils_dict()
    types = await request_type.get_types_dict()
    geojson = await Geometry.get_council_geojson()

    # Get results for past week.
    num_requests_last_week = 0
    for day in range(7):
        num_requests_last_week += len(await service_request.get_filtered_requests(
            date.today() - timedelta(days=day),
            date.today() - timedelta(days=day),
            limit=GET_FILTERED_REQUESTS_LIMIT)
        )

    # Delete any cached CSV files.
    for file in os.scandir(DATA_DIR):
        os.remove(file.path)

    return {
        "open_requests": len(open_requests),
        "open_requests_counts": len(open_requests_counts),
        "types": len(types),
        "councils": len(councils),
        "regions": len(regions),
        "geojson": len(geojson),
        "num_requests_last_week": num_requests_last_week
    }


def classmethod_cache_key(f, *args, **kwargs):
    """
    Utility function to create shorter keys for classmethods (i.e. no class name)
    """
    return format(str(f.__qualname__) + str(args[1:]))


def cache_key(f, *args, **kwargs):
    """
    Utility function to create shorter keys for methods
    """
    return format(
        str(f.__module__).split('.')[-1].capitalize() +
        '.' +
        str(f.__qualname__) + str(args)
    )
