# flake8: noqa
"""first migration

Revision ID: 72973ee94bac
Revises: 
Create Date: 2020-08-28 08:40:00.851112

"""
import os
from os.path import join, dirname
import logging

import csv
from alembic import op
from sqlalchemy import Column
from sqlalchemy.dialects import postgresql
from sqlalchemy.sql.functions import now

SEED_FILE = join(dirname(dirname(__file__)), 'seeds/test_requests.csv')

# revision identifiers, used by Alembic.
revision = '72973ee94bac'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():

    requests_table = op.create_table('requests',
        Column('id', postgresql.INTEGER, autoincrement=True, primary_key=True),
        Column('srnumber', postgresql.VARCHAR, nullable=False, unique=True, index=True),
        Column('requesttype', postgresql.VARCHAR, nullable=True),
        Column('status', postgresql.VARCHAR, nullable=True),
        Column('actiontaken', postgresql.VARCHAR, nullable=True),
        Column('createddate', postgresql.TIMESTAMP, nullable=True),
        Column('updateddate', postgresql.TIMESTAMP, nullable=True),
        Column('servicedate', postgresql.TIMESTAMP, nullable=True),
        Column('closeddate', postgresql.TIMESTAMP, nullable=True),
        Column('requestsource', postgresql.VARCHAR, nullable=True),
        Column('anonymous', postgresql.VARCHAR, nullable=True),
        Column('mobileos', postgresql.VARCHAR, nullable=True),
        Column('owner', postgresql.VARCHAR, nullable=True),
        Column('nc', postgresql.INTEGER, nullable=True),
        Column('ncname', postgresql.VARCHAR, nullable=True),
        Column('policeprecinct', postgresql.VARCHAR, nullable=True),
        Column('apc', postgresql.VARCHAR, nullable=True),
        Column('assignto', postgresql.VARCHAR, nullable=True),
        Column('cd', postgresql.INTEGER, nullable=True),
        Column('cdmember', postgresql.VARCHAR, nullable=True),
        Column('address', postgresql.VARCHAR, nullable=True),
        Column('zipcode', postgresql.VARCHAR, nullable=True),
        Column('latitude', postgresql.DOUBLE_PRECISION(precision=53), nullable=True),
        Column('longitude', postgresql.DOUBLE_PRECISION(precision=53), nullable=True)
    )

    log_table = op.create_table('log',
        Column('id', postgresql.INTEGER, autoincrement=True, primary_key=True),
        Column('status', postgresql.VARCHAR, nullable=False, server_default='INFO'),
        Column('message', postgresql.TEXT, nullable=True),
        Column('created_time', postgresql.TIMESTAMP, nullable=False, server_default=now())
    )

    # seed the database during testing
    if os.getenv("TESTING"):
        with open(SEED_FILE) as f:
            reader = csv.DictReader(f)

            # TODO: is there a better way?
            # Empty String to None Conversion
            conv_list = []
            conv = lambda i : i or None

            for row in reader:
                for k, v in row.items():
                    row[k] = conv(v)
                conv_list.append(row)

            op.bulk_insert(requests_table, conv_list)
        
        logger = logging.getLogger("alembic.runtime.migration")
        logger.info(f"Seeded request data from {SEED_FILE}")

    op.execute("INSERT INTO log (message) VALUES ('Initial database creation')")


def downgrade():

    op.drop_table('requests')
    op.drop_table('log')
