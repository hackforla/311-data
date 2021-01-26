# flake8: noqa

"""add nc geometries

Revision ID: e6a9d89a9510
Revises: 8f2ffbc5c2e8
Create Date: 2021-01-22 17:33:49.286174

"""
from os.path import join, dirname

import geopandas

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
from geoalchemy2 import Geometry


DATA_FOLDER = join(dirname(__file__), '../seeds/')
BOUNDARY_FILE = join(DATA_FOLDER, "nc-boundary-geojson.json")

# revision identifiers, used by Alembic.
revision = 'e6a9d89a9510'
down_revision = '8f2ffbc5c2e8'
branch_labels = None
depends_on = None


def upgrade():
    op.execute("CREATE EXTENSION postgis;")

    geometries_table = op.create_table(
        'geometries',
        sa.Column('nc_id', sa.SMALLINT(), primary_key=True),
        sa.Column('geometry', Geometry(geometry_type="MULTIPOLYGON", srid=4326), nullable=False)
    )

    with open(BOUNDARY_FILE, "r") as read_file:
        boundary_df = geopandas.read_file(read_file)
        boundary_df.drop(boundary_df.columns.difference(['nc_id','geometry']), 1, inplace=True)
        # boundary_df.rename(columns={"nc_id": "council_id"})
        # btw, not sure if doing the as string is the best
        boundary_df['geometry'] = boundary_df['geometry'].astype('str')
        op.bulk_insert(geometries_table, boundary_df.to_dict(orient="records"))
        

def downgrade():
    op.drop_table('geometries')
    op.execute("DROP EXTENSION IF EXISTS postgis CASCADE;")
