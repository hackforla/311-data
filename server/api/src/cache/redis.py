import redis
import pickle
from datetime import timedelta
from settings import Redis


r = redis.from_url(Redis.URL)
TTL = Redis.TTL_SECONDS


def get(key):
    value = r.get(key)
    if value is None:
        return None
    else:
        return pickle.loads(value)


def set(key, value):
    value = pickle.dumps(value)
    try:
        r.setex(key, timedelta(seconds=TTL), value)
    except Exception as e:
        print(e)
