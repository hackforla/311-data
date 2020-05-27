import math
from config import config
from utils.log import log
from . import stage
from . import views
from .. import info
from ..conn import exec_sql


BATCH_SIZE = config['Ingestion']['QUERY_SIZE']


def __update_requests_table():
    log('\nUpdating requests table')
    inserted = exec_sql(f"""
        INSERT INTO requests SELECT * FROM stage
    """)
    log('\tInserted rows: {}'.format(inserted.rowcount))


def add_years(years, rows_per_year=math.inf, batch_size=BATCH_SIZE):
    # exclude years that are already in the db
    has_years = info.years()
    years = [year for year in years if year not in has_years]
    if len(years) == 0:
        return

    # add requests for each remaining year
    for year in years:
        stage.create_table()
        stage.fetch_year(
            year=year,
            num_rows=rows_per_year,
            batch_size=batch_size)
        stage.clean_table()
        __update_requests_table()
        stage.drop_table()

    # finish up
    views.refresh()
    info.update()
