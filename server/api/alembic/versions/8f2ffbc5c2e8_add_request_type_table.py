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


def upgrade():

    request_types_table = op.create_table(
        'request_types',
        sa.Column('type_id', sa.SMALLINT(), primary_key=True),
        sa.Column('type_name', sa.VARCHAR(), nullable=False),
        sa.Column('agency_id', sa.SMALLINT(), nullable=False),
        sa.Column('color', sa.VARCHAR()),
        sa.Column('data_code', sa.VARCHAR(), index=True, nullable=False),
    )

    with open(DATA_FOLDER + 'request_types.csv') as f:
        op.bulk_insert(request_types_table, list(csv.DictReader(f)))
        

def downgrade():
    
    op.drop_table('request_types')
