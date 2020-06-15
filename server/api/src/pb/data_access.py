import os
import pickle
import shutil
import json
from settings import Server


DATA_DIR = os.path.join(Server.TMP_DIR, 'picklebase')
STAGE_DIR = os.path.join(Server.TMP_DIR, 'picklebase-stage')
READY_FILE = os.path.join(DATA_DIR, 'ready')


# ########## RESETS ########### #

def clear_stage():
    shutil.rmtree(STAGE_DIR, ignore_errors=True)


def clear_data():
    shutil.rmtree(DATA_DIR, ignore_errors=True)


# ###### PATHS / FILENAMES ##### #

def stage_table_path(table):
    return os.path.join(STAGE_DIR, table)


def table_path(table):
    return os.path.join(DATA_DIR, table)


def stage_meta_path(table):
    return os.path.join(STAGE_DIR, table, 'meta.json')


def meta_path(table):
    return os.path.join(DATA_DIR, table, 'meta.json')


def batch_filename(batch_num):
    return f'batch_{batch_num}'


# ############ WRITING ########### #

def init_table(table):
    path = stage_table_path(table)
    shutil.rmtree(path, ignore_errors=True)
    os.makedirs(path, exist_ok=True)


def save_batch(table, batch_num, batch):
    filename = batch_filename(batch_num)
    path = os.path.join(stage_table_path(table), filename)
    with open(path, 'wb') as f:
        pickle.dump(batch, f)
    return filename, os.path.getsize(path)


def save_meta(table, meta):
    path = stage_meta_path(table)
    meta_json = json.dumps(meta, indent=2)
    print('\nSaving meta:', flush=True)
    print(meta_json, flush=True)
    with open(path, 'w') as f:
        f.write(meta_json)


def commit_pb():
    shutil.rmtree(DATA_DIR, ignore_errors=True)
    shutil.move(STAGE_DIR, DATA_DIR)
    with open(READY_FILE, 'w'):
        pass


# ########### READING ########### #

def load_batch(table, batch_num):
    path = os.path.join(table_path(table), batch_filename(batch_num))
    with open(path, 'rb') as f:
        return pickle.load(f)


def load_meta(table):
    path = meta_path(table)
    with open(path, 'r') as f:
        return json.load(f)


def check_ready():
    return os.path.isfile(READY_FILE)
