from .. import info
from ..conn import exec_sql
from . import views
from utils.log import log


def drop_years(years):
    # exclude years not in db
    has_years = info.years()
    years = [year for year in years if year in has_years]
    if len(years) == 0:
        return

    # drop years
    log('Dropping years: {}'.format(years))
    years = (', ').join([f"'{year}'" for year in years])
    exec_sql(f"""
        DELETE FROM requests
        WHERE date_part('year', createddate) IN ({years})
    """)

    # finish up
    views.refresh()
