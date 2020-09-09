# flake8: noqa

"""adding region geometry

Revision ID: be025aca45ef
Revises: 72973ee94bac
Create Date: 2020-08-28 12:09:39.259710

"""
from os.path import join, dirname
import csv

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'be025aca45ef'
down_revision = '72973ee94bac'
branch_labels = None
depends_on = None

DATA_FOLDER = join(dirname(__file__), '../seeds/')


def upgrade():

    regions_table = op.create_table(
        'regions',
        sa.Column('region_id', sa.SMALLINT(), primary_key=True),
        sa.Column('region_name', sa.VARCHAR(), nullable=False),
        sa.Column('latitude', sa.FLOAT(), nullable=True),
        sa.Column('longitude', sa.FLOAT(), nullable=True)
    )

    with open(DATA_FOLDER + 'regions.csv') as f:
        op.bulk_insert(regions_table, list(csv.DictReader(f)))


    councils_table = op.create_table(
        'councils',
        sa.Column('council_id', sa.SMALLINT(), primary_key=True),
        sa.Column('council_name', sa.VARCHAR(), nullable=False),
        sa.Column('waddress', sa.VARCHAR()),
        sa.Column('dwebsite', sa.VARCHAR()),
        sa.Column('region_id', sa.SMALLINT(), index=True, nullable=False),
        sa.Column('latitude', sa.FLOAT(), nullable=True),
        sa.Column('longitude', sa.FLOAT(), nullable=True)
    )

    with open(DATA_FOLDER + 'councils.csv') as f:
        op.bulk_insert(councils_table, list(csv.DictReader(f)))


def downgrade():

    op.drop_table('councils')
    op.drop_table('regions')
