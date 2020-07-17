from .conn import exec_sql
from . import info
from . import requests
from utils.log import log


def reset():
    log('\nResetting database')

    exec_sql("""
        DROP TABLE IF EXISTS requests CASCADE;
        DROP TABLE IF EXISTS stage;
        DROP TABLE IF EXISTS metadata;
    """)

    info.create_table()
    requests.create_table()
    requests.create_views()
