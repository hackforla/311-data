import os
import pickle
import shutil
import json


TMP_DIR = os.environ.get('TMP_DIR', os.getcwd())
DATA_DIR = os.path.join(TMP_DIR, 'static/picklebase')
READY_FILE = os.path.join(DATA_DIR, 'ready')


def clear_data():
    shutil.rmtree(DATA_DIR, ignore_errors=True)
    os.makedirs(DATA_DIR, exist_ok=True)


def table_path(table):
    return os.path.join(DATA_DIR, table)


def init_table(table):
    path = table_path(table)
    shutil.rmtree(path, ignore_errors=True)
    os.makedirs(path, exist_ok=True)


def batch_filename(batch_num):
    return f'batch_{batch_num}'


def save_batch(table, batch_num, batch):
    filename = batch_filename(batch_num)
    path = os.path.join(table_path(table), filename)
    with open(path, 'wb') as f:
        pickle.dump(batch, f)
    return filename, os.path.getsize(path)


def load_batch(table, batch_num):
    path = os.path.join(table_path(table), batch_filename(batch_num))
    with open(path, 'rb') as f:
        return pickle.load(f)


def meta_path(table):
    return os.path.join(DATA_DIR, table, 'meta.json')


def save_meta(table, meta):
    path = meta_path(table)
    meta_json = json.dumps(meta, indent=2)
    print('\nSaving meta:', flush=True)
    print(meta_json, flush=True)
    with open(path, 'w') as f:
        f.write(meta_json)


def load_meta(table):
    path = meta_path(table)
    with open(path, 'r') as f:
        return json.load(f)


def set_ready():
    with open(READY_FILE, 'w') as f:
        pass


def check_ready():
    return os.path.isfile(READY_FILE)
