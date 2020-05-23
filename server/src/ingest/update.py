from config import config
from datetime import timedelta
from utils.database import db
from utils.log import log
from .socrata import SocrataClient
from .metadata import update_metadata_table
from .download import (
    drop_download_table,
    create_download_table,
    download_years)
from .clean import clean_download_table
from .views import refresh_views


YEARS = config['Ingestion']['YEARS']
LIMIT = config['Ingestion']['LIMIT']
QUERY_SIZE = config['Ingestion']['QUERY_SIZE']


def last_updated():
    rows = db.exec_sql('SELECT last_pulled FROM metadata')
    last_pulled = rows.first().last_pulled
    return last_pulled.replace(tzinfo=None, microsecond=0)


def populate_download_table():
    # subtract a day to account for issues with socrata's
    # updateddate sorting
    since = (last_updated() - timedelta(days=1)).isoformat()

    client = SocrataClient()
    download_years(
        years=YEARS,
        max_rows=LIMIT,
        batch_size=QUERY_SIZE,
        fetch_rows=lambda year, batch_size, offset: client.get(
            year,
            where=f"updateddate >= '{since}'",
            offset=offset,
            limit=batch_size))


def update_requests_table():
    log('\nUpdating requests table')

    removed = db.exec_sql(f"""
        DELETE FROM requests
        WHERE srnumber IN (SELECT srnumber from download)
    """)
    log('\tDropped rows: {}'.format(removed.rowcount))

    inserted = db.exec_sql(f"""
        INSERT INTO requests
        SELECT * FROM download
    """)
    log('\tInserted rows: {}'.format(inserted.rowcount))

    rows_added = inserted.rowcount - removed.rowcount
    log('\tTotal rows added: {}'.format(rows_added))


def update():
    log('\nUPDATING DATABASE')

    create_download_table()
    populate_download_table()
    clean_download_table()
    update_requests_table()
    drop_download_table()

    refresh_views()
    update_metadata_table()

    log('\nUPDATE COMPLETE\n')
