# import hashlib
from datetime import date, timedelta
from dateutil.relativedelta import relativedelta

from ..models import (
    request_type, council, region, service_request, geometry
)
# from ..config import DEBUG


async def build_cache():
    open_requests = await service_request.get_open_requests()
    open_requests_counts = await service_request.get_open_request_counts()
    regions = await region.get_regions_dict()
    councils = await council.get_councils_dict()
    types = await request_type.get_types_dict()
    geojson = await geometry.Geometry.get_council_geojson()

    # for i in councils:
    #     await council.get_open_request_counts(i)

    # get results for past week
    await service_request.get_filtered_requests(
        date.today() - timedelta(days=7.0),
        date.today(),
        list(types),
        list(councils),
    )

    # get results for past month
    await service_request.get_filtered_requests(
        date.today() - relativedelta(months=1),
        date.today(),
        list(types),
        list(councils),
    )

    return {
        "open_requests": len(open_requests),
        "open_requests_counts": len(open_requests_counts),
        "types": len(types),
        "councils": len(councils),
        "regions": len(regions),
        "geojson": len(geojson)
    }


def classmethod_cache_key(f, *args, **kwargs):
    """
    Utility function to create shorter keys for classmethods (i.e. no class name)
    """
    return format(str(f.__qualname__) + str(args[1:]))


# TODO: maybe recessitate this for object keys (e.g. filters)
# def cache_key(f, *args, **kwargs):
#     """
#     Utility function to create hashed key for pins based on filters
#     """

#     # want to sort the values for types and councils
#     for i in args:
#         if type(i) == list:
#             i.sort()

#     object_key = str(args).encode('utf-8')  # need a b-string for hashing
#     hashed_key = hashlib.md5(object_key).hexdigest()

#     # use unhashed string if in DEBUG mode
#     if DEBUG:
#         # this should match the default aiocache key format
#         return format(str(f.__module__) + str(f.__name__) + str(args))
#     else:
#         # caching without the module and function to potentially make reusable
#         return format(hashed_key)
