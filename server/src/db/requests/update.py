import math
from datetime import timedelta
from config import config
from utils.log import log
from .. import info
from ..conn import exec_sql
from . import stage
from . import views


BATCH_SIZE = config['Ingestion']['QUERY_SIZE']


def __update_requests_table():
    log('\nUpdating requests table')

    removed = exec_sql(f"""
        DELETE FROM requests
        WHERE srnumber IN (SELECT srnumber from stage)
    """)
    log('\tDropped rows: {}'.format(removed.rowcount))

    inserted = exec_sql(f"""
        INSERT INTO requests SELECT * FROM stage
    """)
    log('\tInserted rows: {}'.format(inserted.rowcount))

    new_rows = inserted.rowcount - removed.rowcount
    log('\tTotal new rows: {}'.format(new_rows))


def update():
    log('\nUPDATING DATABASE')

    # only update the years in the db
    years = info.years()
    if len(years) == 0:
        log('\nNo years to update.')
        return

    # subtract one day to account for irregularity
    # in socrata's updateddate sort
    last_updated = info.last_updated() - timedelta(days=1)

    # update all years and copy to requests table
    stage.create_table()
    for year in years:
        stage.fetch_year(
            year=year,
            num_rows=math.inf,
            batch_size=BATCH_SIZE,
            since=last_updated)
    stage.clean_table()
    __update_requests_table()
    stage.drop_table()

    # finish up
    views.refresh()
    info.update()

    log('\nUPDATE COMPLETE\n')
