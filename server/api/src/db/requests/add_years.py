from settings import Socrata
from utils.log import log
from . import stage
from . import views
from .. import info
from ..conn import exec_sql


def __update_requests_table(year):
    log('\nUpdating requests table')

    # TODO: make this more robust.
    # Request 1-870704814 shows up in both 2017 and 2018 in socrata's data.
    # It's the only request out of 5.4 million that appears in multiple years.
    # Need to delete one of them since srnumber is constrained to be unique in
    # the requests table.
    if year == 2017:
        exec_sql("DELETE FROM stage WHERE srnumber = '1-870704814'")
        log('\tDropping srnumber 1-870704814 because it exists in 2018')

    inserted = exec_sql("""
        INSERT INTO requests SELECT * FROM stage
    """)
    log('\tInserted rows: {}'.format(inserted.rowcount))


def add_years(years,
              rows_per_year=-1,
              batch_size=Socrata.BATCH_SIZE):

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
        __update_requests_table(year)
        stage.drop_table()

    # finish up
    views.refresh()
    info.update()
