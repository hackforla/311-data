import os
import time
import pickle
from settings import Server, Picklecache
from utils.log import log, log_heading


CACHE_DIR = os.path.join(Server.TMP_DIR, 'picklecache')
TTL_SECONDS = Picklecache.TTL_SECONDS
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
        log(e)


def clean():
    log_heading('cleaning picklecache')
    file_names = os.listdir(CACHE_DIR)

    if len(file_names) == 0:
        log('picklecache is empty.')
        return

    now = time.time()
    for file_name in file_names:
        path = os.path.join(CACHE_DIR, file_name)
        stat = os.stat(path)
        age = round(now - stat.st_mtime)
        if age > TTL_SECONDS:
            log(f'deleting: {file_name} (age {age})')
            os.remove(path)
