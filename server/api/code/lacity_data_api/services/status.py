from aiocache import cached

from ..models import db, cache
from ..config import CACHE_MAXMEMORY


@cached(alias="default")
async def get_last_updated():
    query = db.text("SELECT max(created_time) as last_pulled FROM log WHERE status = 'INFO'")  # noqa
    result = await db.first(query)
    return result.last_pulled.replace(tzinfo=None)


async def get_db_version():
    query = db.text("SELECT version()")
    result = await db.first(query)
    return result.version


async def get_alembic_version():
    query = db.text("SELECT version_num FROM alembic_version")
    result = await db.first(query)
    return result.version_num


async def get_request_types_count():
    query = db.text("SELECT count(*) FROM request_types")
    result = await db.scalar(query)
    return result


async def get_regions_count():
    query = db.text("SELECT count(*) FROM regions")
    result = await db.scalar(query)
    return result


async def get_councils_count():
    query = db.text("SELECT count(*) FROM councils")
    result = await db.scalar(query)
    return result


async def get_service_requests_count():
    query = db.text("SELECT count(*) FROM service_requests")
    result = await db.scalar(query)
    return result


async def get_requests_count():
    query = db.text("SELECT count(*) FROM requests")
    result = await db.scalar(query)
    return result


async def get_cache_info():
    return await cache.raw("info")


async def get_cache_keys():
    return await cache.raw("keys", "*")


async def reset_cache():
    # setting memory limit and policy on Redis
    await cache.raw("config_set", "maxmemory-policy", "allkeys-lru")
    await cache.raw("config_set", "maxmemory", CACHE_MAXMEMORY)
    await cache.raw("flushdb")
    return True


async def get_recent_log():
    query = db.text("SELECT * FROM log ORDER BY created_time DESC LIMIT 10")
    result = await db.all(query)
    return result
