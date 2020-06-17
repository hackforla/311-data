from ..conn import exec_sql
from . import stage


def create():
    stage.create_table()
    exec_sql("""
        ALTER TABLE stage RENAME TO requests;
        ALTER TABLE requests DROP COLUMN id;
        ALTER TABLE requests ADD PRIMARY KEY (srnumber);
    """)
