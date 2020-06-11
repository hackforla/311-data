import os
import pickle
from settings import Server


CACHE_DIR = os.path.join(Server.TMP_DIR, 'picklecache')
os.makedirs(CACHE_DIR, exist_ok=True)


def get(key):
    try:
        path = os.path.join(CACHE_DIR, key)
        with open(path, 'rb') as f:
            return pickle.load(f)
    except Exception:
        return None


def set(key, value):
    try:
        path = os.path.join(CACHE_DIR, key)
        with open(path, 'wb') as f:
            pickle.dump(value, f, protocol=pickle.HIGHEST_PROTOCOL)
    except Exception as e:
        print(e)
