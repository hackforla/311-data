import os
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


class PickleCache(object):
    TMP_DIR = os.environ.get('TMP_DIR', os.getcwd())
    CACHE_DIR = os.path.join(TMP_DIR, 'static/picklecache')

    def __init__(self):
        print('PICKLECACHE ENABLED')
        os.makedirs(self.CACHE_DIR, exist_ok=True)

    def config(self, config=None):
        pass

    def get(self, key):
        try:
            path = os.path.join(self.CACHE_DIR, key)
            with open(path, 'rb') as f:
                return pickle.load(f)
        except Exception:
            return None

    def set(self, key, value):
        try:
            path = os.path.join(self.CACHE_DIR, key)
            with open(path, 'wb') as f:
                pickle.dump(value, f, protocol=pickle.HIGHEST_PROTOCOL)
        except Exception as e:
            print(e)


if int(os.environ.get('PICKLECACHE', 0)) == 1:
    cache = PickleCache()
else:
    cache = RedisCache()
