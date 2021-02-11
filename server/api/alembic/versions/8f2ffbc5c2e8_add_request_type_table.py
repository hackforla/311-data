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
        SELECT 
            requests.id as request_id,
            requests.srnumber::VARCHAR(12) as srnumber,
            requests.createddate::DATE as created_date,
            requests.closeddate::DATE as closed_date,
            request_types.type_id as type_id,
            requests.nc::SMALLINT as council_id,
            councils.region_id,
            requests.cd::SMALLINT as city_id,
            requests.address::VARCHAR(100),
            requests.latitude,
            requests.longitude
        FROM 
            requests, request_types, councils
        WHERE
            requests.nc IS NOT NULL
            AND requests.latitude IS NOT NULL
            AND requests.longitude IS NOT NULL
            AND requests.requesttype = request_types.data_code
            AND requests.nc = councils.council_id
            ;

        CREATE UNIQUE INDEX ON service_requests(request_id);
        CREATE UNIQUE INDEX ON service_requests(srnumber);
        CREATE INDEX ON service_requests(created_date);
        CREATE INDEX ON service_requests(closed_date);
        CREATE INDEX ON service_requests(type_id);
        CREATE INDEX ON service_requests(council_id);
        CREATE INDEX ON service_requests(region_id);
        CREATE INDEX ON service_requests(city_id);
    """


def upgrade():

    request_types_table = op.create_table(
        'request_types',
        sa.Column('type_id', sa.SMALLINT(), primary_key=True),
        sa.Column('type_name', sa.VARCHAR(), nullable=False),
        sa.Column('type_group', sa.VARCHAR()),
        sa.Column('color', sa.VARCHAR()),
        sa.Column('data_code', sa.VARCHAR(), nullable=False),
        sa.Column('sort_order', sa.SMALLINT())
    )

    with open(DATA_FOLDER + 'request_types.csv') as f:
        op.bulk_insert(request_types_table, list(csv.DictReader(f)))

    op.execute(REQUESTS_VIEW)


def downgrade():

    op.execute("DROP MATERIALIZED VIEW service_requests")
    
    op.drop_table('request_types')
