from settings import Socrata
from datetime import timedelta
from utils.log import log, log_heading
from .. import info
from ..conn import exec_sql
from . import stage
from . import views


def __update_requests_table():
    log('\nUpdating requests table')

    removed = exec_sql("""
        DELETE FROM requests
        WHERE srnumber IN (SELECT srnumber from stage)
    """)
    log('\tDropped rows: {}'.format(removed.rowcount))

    inserted = exec_sql("""
        INSERT INTO requests SELECT * FROM stage
    """)
    log('\tInserted rows: {}'.format(inserted.rowcount))

    new_rows = inserted.rowcount - removed.rowcount
    log('\tTotal new rows: {}'.format(new_rows))


def update():
    log_heading('updating database', spacing=(1, 0))

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
            num_rows=-1,
            batch_size=Socrata.BATCH_SIZE,
            since=last_updated)
    stage.clean_table()
    __update_requests_table()
    stage.drop_table()

    # finish up
    views.refresh()
    info.update()

    log('\nUpdate complete.')
