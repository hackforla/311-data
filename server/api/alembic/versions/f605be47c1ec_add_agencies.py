# flake8: noqa

"""add agencies

Revision ID: f605be47c1ec
Revises: e6a9d89a9510
Create Date: 2021-02-15 10:37:43.545716

"""
from os.path import join, dirname
import csv

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision = 'f605be47c1ec'
down_revision = 'e6a9d89a9510'
branch_labels = None
depends_on = None


DATA_FOLDER = join(dirname(__file__), '../seeds/')

REQUESTS_VIEW = """
        CREATE MATERIALIZED VIEW service_requests AS
        SELECT 
            requests.id as request_id,
            requests.srnumber::VARCHAR(12) as srnumber,
            requests.createddate::DATE as created_date,
            requests.closeddate::DATE as closed_date,
            request_types.type_id as type_id,
            agencies.agency_id,
            COALESCE(councils.council_id, 0)::SMALLINT as council_id,
            COALESCE(councils.region_id, 0)::SMALLINT as region_id,
            requests.address::VARCHAR(100),
            requests.latitude,
            requests.longitude,
            requests.cd::SMALLINT as city_id
        FROM 
            requests
        LEFT JOIN 
            request_types on requests.requesttype = request_types.data_code
        LEFT JOIN 
            councils on requests.nc = councils.data_code
        LEFT JOIN 
            agencies on requests.owner = agencies.data_code
        WHERE 
            requests.latitude IS NOT NULL
            ;

        CREATE UNIQUE INDEX ON service_requests(request_id);
        CREATE UNIQUE INDEX ON service_requests(srnumber);
        CREATE INDEX ON service_requests(created_date);
        CREATE INDEX ON service_requests(closed_date);
        CREATE INDEX ON service_requests(type_id);
        CREATE INDEX ON service_requests(agency_id);
        CREATE INDEX ON service_requests(council_id);
        CREATE INDEX ON service_requests(region_id);
        CREATE INDEX ON service_requests(city_id);
    """


def upgrade():

    agencies_table = op.create_table(
        'agencies',
        sa.Column('agency_id', sa.SMALLINT(), primary_key=True),
        sa.Column('agency_name', sa.VARCHAR(), nullable=False),
        sa.Column('website', sa.VARCHAR(), nullable=True),
        sa.Column('twitter', sa.VARCHAR(), nullable=True),
        sa.Column('data_code', sa.VARCHAR(), nullable=False),
    )

    with open(DATA_FOLDER + 'agencies.csv') as f:
        op.bulk_insert(agencies_table, list(csv.DictReader(f)))

    op.execute(REQUESTS_VIEW)


def downgrade():

    op.execute("DROP MATERIALIZED VIEW service_requests")
    op.drop_table('agencies')
