from config import config
from utils.database import db
from utils.log import log
from .socrata import SocrataClient
from .metadata import create_metadata_table
from .download import create_download_table, download_years
from .clean import clean_download_table
from .views import create_views


YEARS = config['Ingestion']['YEARS']
LIMIT = config['Ingestion']['LIMIT']
QUERY_SIZE = config['Ingestion']['QUERY_SIZE']


def reset_database():
    db.exec_sql(f"""
        DROP TABLE IF EXISTS requests CASCADE;
        DROP TABLE IF EXISTS download;
        DROP TABLE IF EXISTS metadata;
    """)


def populate_download_table():
    client = SocrataClient()
    download_years(
        years=YEARS,
        max_rows=LIMIT,
        batch_size=QUERY_SIZE,
        fetch_rows=lambda year, batch_size, offset: client.get(
            year,
            offset=offset,
            limit=batch_size))


def rename_download_table():
    db.exec_sql(f"""
        ALTER TABLE download
        RENAME TO requests
    """)


def populate():
    log('\nPOPULATING DATABASE')

    reset_database()
    create_metadata_table()

    create_download_table()
    populate_download_table()
    clean_download_table()
    rename_download_table()

    create_views()

    log('\nPOPULATION COMPLETE')
