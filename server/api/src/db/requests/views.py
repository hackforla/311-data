from utils.log import log
from ..conn import exec_sql


def create():
    exec_sql("""
        CREATE MATERIALIZED VIEW map AS (
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
        ) WITH DATA;

        CREATE UNIQUE INDEX ON map(srnumber);
        CREATE INDEX ON map(nc);
        CREATE INDEX ON map(requesttype);
        CREATE INDEX ON map(createddate);

    """)

    exec_sql("""
        CREATE MATERIALIZED VIEW vis AS (
            SELECT
                srnumber,
                createddate,
                requesttype,
                nc,
                cd,
                requestsource,
                _daystoclose
            FROM requests
        ) WITH DATA;

        CREATE UNIQUE INDEX ON vis(srnumber);
        CREATE INDEX ON vis(nc);
        CREATE INDEX ON vis(cd);
        CREATE INDEX ON vis(requesttype);
        CREATE INDEX ON vis(createddate);

    """)

    exec_sql("""
        CREATE MATERIALIZED VIEW open_requests AS (
            SELECT
                srnumber,
                requesttype,
                latitude,
                longitude,
                nc,
                cd
            FROM requests
            WHERE
                status = 'Open' AND
                latitude IS NOT NULL AND
                longitude IS NOT NULL
        ) WITH DATA;

        CREATE UNIQUE INDEX ON open_requests(srnumber);

    """)


def refresh():
    log('\nRefreshing views')
    exec_sql("""
        REFRESH MATERIALIZED VIEW CONCURRENTLY map;
        REFRESH MATERIALIZED VIEW CONCURRENTLY vis;
        REFRESH MATERIALIZED VIEW CONCURRENTLY open_requests;

    """)
