import redis
import pickle
from datetime import timedelta
from config import config


class RedisCache(object):
    def __init__(self):
        conf = config['Redis']

        if conf['URL'] is None:
            self.enabled = False
        else:
            self.r = redis.from_url(conf['URL'])
            self.ttl = conf['TTL_SECONDS']
            self.enabled = True

    def get(self, key):
        if not self.enabled:
            return None

        value = self.r.get(key)
        if value is None:
            return None
        else:
            return pickle.loads(value)

    def set(self, key, value):
        if not self.enabled:
            return None

        value = pickle.dumps(value)
        try:
            self.r.setex(key, timedelta(seconds=self.ttl), value)
        except Exception as e:
            print(e)


cache = RedisCache()
