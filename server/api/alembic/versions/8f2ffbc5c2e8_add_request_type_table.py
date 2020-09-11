# flake8: noqa

"""add request type table

Revision ID: 8f2ffbc5c2e8
Revises: be025aca45ef
Create Date: 2020-09-08 20:42:55.565506

"""
from os.path import join, dirname
import csv
import os

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

DATA_FOLDER = join(dirname(__file__), '../seeds/')

# revision identifiers, used by Alembic.
revision = '8f2ffbc5c2e8'
down_revision = 'be025aca45ef'
branch_labels = None
depends_on = None

REQUESTS_VIEW = """
        CREATE MATERIALIZED VIEW service_requests AS
        SELECT right(requests.srnumber::VARCHAR(12), -2)::INTEGER as request_id,
            requests.createddate::DATE as created_date,
            requests.closeddate::DATE as closed_date,
            request_types.type_id as type_id,
            requests.nc::SMALLINT as council_id,
            councils.region_id,
            requests.address::VARCHAR(100),
            requests.latitude,
            requests.longitude
        FROM requests, request_types, councils
        WHERE
            requests.nc IS NOT NULL
            AND requests.latitude IS NOT NULL
            AND requests.longitude IS NOT NULL
            AND requests.requesttype = request_types.data_code
            AND requests.nc = councils.council_id
            ;

        CREATE UNIQUE INDEX ON service_requests(request_id);
        CREATE INDEX ON service_requests(created_date);
        CREATE INDEX ON service_requests(type_id);
        CREATE INDEX ON service_requests(council_id);
        CREATE INDEX ON service_requests(region_id);
    """

MAP_VIEW = """
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
    """

VIS_VIEW = """
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
    """

def upgrade():

    request_types_table = op.create_table(
        'request_types',
        sa.Column('type_id', sa.SMALLINT(), primary_key=True),
        sa.Column('type_name', sa.VARCHAR(), nullable=False),
        sa.Column('color', sa.VARCHAR()),
        sa.Column('data_code', sa.VARCHAR(), nullable=False)
    )

    with open(DATA_FOLDER + 'request_types.csv') as f:
        op.bulk_insert(request_types_table, list(csv.DictReader(f)))

    op.execute(REQUESTS_VIEW)

    if os.getenv("TESTING"):
        op.execute(MAP_VIEW)
        op.execute(VIS_VIEW)


def downgrade():

    if os.getenv("TESTING"):
        op.execute("DROP MATERIALIZED VIEW map")
        op.execute("DROP MATERIALIZED VIEW vis")

    op.execute("DROP MATERIALIZED VIEW service_requests")
    op.drop_table('request_types')
