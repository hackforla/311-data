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

    # TODO: this is a potential new refactor of the database not currently in API
    exec_sql("""

        CREATE MATERIALIZED VIEW regions AS
        WITH join_table AS (
            select distinct apc
            from requests
            where apc is not null
        ) SELECT
            ROW_NUMBER () OVER (order by apc) as region_id,
            left(apc, -4) as region_name
        FROM join_table;

        CREATE UNIQUE INDEX ON regions(region_id);

        ------------------------------------------

        CREATE MATERIALIZED VIEW councils AS
        SELECT DISTINCT on (nc)
            nc as council_id,
            ncname as council_name,
            region_id
        FROM requests
        LEFT JOIN regions ON left(requests.apc, -4) = regions.region_name
        WHERE requests.nc is not null
        ORDER BY nc, createddate desc;

        CREATE UNIQUE INDEX ON councils(council_id);
        CREATE INDEX ON councils(region_id);

        --add shortname, geometry, centroid, d and w websites

        ------------------------------------------

        CREATE MATERIALIZED VIEW request_types AS
        WITH join_table AS (
            select distinct requesttype
            from requests
        ) SELECT
            ROW_NUMBER () OVER (order by requesttype) as type_id,
            requesttype as type_name
        FROM join_table;

        CREATE UNIQUE INDEX ON request_types(type_id);

        --colors: primary/alt, abbreviations

        ------------------------------------------

        CREATE MATERIALIZED VIEW service_requests AS
        SELECT right(requests.srnumber::VARCHAR(12), -2)::INTEGER as request_id,
            requests.createddate::DATE as created_date,
            requests.closeddate::DATE as closed_date,
            request_types.type_id as type_id,
            requests.nc::SMALLINT as council_id,
            requests.address::VARCHAR(100),
            requests.latitude,
            requests.longitude
        FROM requests, request_types
        WHERE
            requests.latitude IS NOT NULL
            AND requests.longitude IS NOT NULL
            AND type_name = requests.requesttype;

        CREATE UNIQUE INDEX ON service_requests(request_id);
        CREATE INDEX ON service_requests(created_date);
        CREATE INDEX ON service_requests(type_id);
        CREATE INDEX ON service_requests(council_id);

    """)


def refresh():
    log('\nRefreshing views')
    exec_sql("""
        REFRESH MATERIALIZED VIEW CONCURRENTLY map;
        REFRESH MATERIALIZED VIEW CONCURRENTLY vis;
        REFRESH MATERIALIZED VIEW CONCURRENTLY open_requests;
        REFRESH MATERIALIZED VIEW CONCURRENTLY service_requests;
    """)
