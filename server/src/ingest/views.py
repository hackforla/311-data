from utils.database import db
from .download import log


def create_views():
    log('\nCreating views on requests table')

    # map view
    res = db.exec_sql(f"""
        CREATE MATERIALIZED VIEW map AS
            SELECT
                srnumber,
                createddate,
                requesttype,
                nc,
                latitude,
                longitude
            FROM requests
            WHERE
                latitude IS NOT NULL AND
                longitude IS NOT NULL
        WITH DATA;
    """)

    db.exec_sql(f"""
        CREATE UNIQUE INDEX ON map(srnumber);
        CREATE INDEX ON map(nc);
        CREATE INDEX ON map(requesttype);
        CREATE INDEX ON map(createddate);
    """)

    log(f'\tcreated map view: {res.rowcount} rows')

    # vis view
    res = db.exec_sql(f"""
        CREATE MATERIALIZED VIEW vis AS
            SELECT
                srnumber,
                createddate,
                requesttype,
                nc,
                cd,
                requestsource,
                _daystoclose
            FROM requests
        WITH DATA;
    """)

    db.exec_sql(f"""
        CREATE UNIQUE INDEX ON vis(srnumber);
        CREATE INDEX ON vis(nc);
        CREATE INDEX ON vis(cd);
        CREATE INDEX ON vis(requesttype);
        CREATE INDEX ON vis(createddate);
    """)

    log(f'\tcreated vis view: {res.rowcount} rows')


def refresh_views():
    log('\nRefreshing views')

    db.exec_sql(f"""
        REFRESH MATERIALIZED VIEW CONCURRENTLY map
    """)
    log('\tRefreshed map view')

    db.exec_sql(f"""
        REFRESH MATERIALIZED VIEW CONCURRENTLY vis
    """)
    log('\tRefreshed vis view')
