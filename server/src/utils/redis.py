import redis
import pickle
from datetime import timedelta


class RedisCache(object):
    def config(self, config):
        self.enabled = config['ENABLED'] == 'True'
        if self.enabled:
            self.ttl = int(config['TTL_SECONDS'])
            self.r = redis.Redis(host='redis')

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
