from settings import Redis, Picklecache

if Redis.ENABLED:
    from .redis import get, set
elif Picklecache.ENABLED:
    from .picklecache import get, set
else:
    from .stub import get, set

__all__ = ['get', 'set']
