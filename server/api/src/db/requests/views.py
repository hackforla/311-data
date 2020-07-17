from utils.log import log
from ..conn import exec_sql


def create():
    exec_sql("""
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
                longitude IS NOT NULL;

        CREATE UNIQUE INDEX ON map(srnumber);
        CREATE INDEX ON map(nc);
        CREATE INDEX ON map(requesttype);
        CREATE INDEX ON map(createddate);
    """)

    exec_sql("""
        CREATE MATERIALIZED VIEW vis AS
            SELECT
                srnumber,
                createddate,
                requesttype,
                nc,
                cd,
                requestsource,
                _daystoclose
            FROM requests;

        CREATE UNIQUE INDEX ON vis(srnumber);
        CREATE INDEX ON vis(nc);
        CREATE INDEX ON vis(cd);
        CREATE INDEX ON vis(requesttype);
        CREATE INDEX ON vis(createddate);
    """)


def refresh():
    log('\nRefreshing views')
    exec_sql("""
        REFRESH MATERIALIZED VIEW CONCURRENTLY map;
        REFRESH MATERIALIZED VIEW CONCURRENTLY vis;
    """)
