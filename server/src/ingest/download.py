from utils.database import db
from utils.log import log
from .download_table import Download, Base


def drop_download_table():
    Base.metadata.drop_all(db.engine)


def create_download_table():
    Base.metadata.create_all(db.engine)


def insert_rows(rows):
    log(f'\tInserting {len(rows)} rows')
    session = db.Session()
    session.bulk_insert_mappings(Download, rows)
    session.commit()
    session.close()


def download_year(year, max_rows, batch_size, fetch_rows):
    log('\nYear: {}'.format(year))

    rows_inserted = 0
    for offset in range(0, max_rows, batch_size):
        rows = fetch_rows(year, batch_size, offset)
        insert_rows(rows)
        rows_inserted += len(rows)

        if len(rows) < batch_size:
            break

    log('\tTotal rows inserted: {}'.format(rows_inserted))


def download_years(years, max_rows, batch_size, fetch_rows):
    for year in years:
        download_year(year, max_rows, batch_size, fetch_rows)
