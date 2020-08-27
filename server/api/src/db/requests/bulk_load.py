import gzip
import csv
import psycopg2
from settings import Database, Picklecache
from . import views
from .. import info
from utils.log import log
import db
import cache


def bulk_load():
    conn = psycopg2.connect(Database.URL)
    cur = conn.cursor()
    columns = ['srnumber',
                'createddate',
                'closeddate',
                '_daystoclose',
                'updateddate',
                'servicedate',
                'requesttype',
                'requestsource',
                'actiontaken',
                'owner',
                'status',
                'createdbyuserorganization',
                'mobileos',
                'anonymous',
                'assignto',
                'latitude',
                'longitude',
                'cd',
                'cdmember',
                'nc',
                'ncname']

    # with gzip.open(CSV_FILE, 'rt') as f:
    with open('data/small.csv', 'r') as f:
        next(f)  # Skip the header row.
        row = f.readline()
        print(row)
        cur.copy_from(f, 'requests', sep=',', null="", columns=columns)

    conn.commit()


def load_file(csv_file):
    """Reset the database, load data from file, and update views"""
    db.reset()

    conn = psycopg2.connect(Database.URL)
    cur = conn.cursor()

    log(f'\nLoading request data from {csv_file}')

    records_written = 0

    with gzip.open(csv_file, 'rt') as f:
        reader = csv.reader(f)
        next(reader)  # Skip the header row.
        for row in reader:
            row[:] = [None if i == "" else i for i in row]
            cur.execute(
                """
                INSERT INTO requests VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s,
                                             %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,
                                             %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,
                                             %s, %s, %s, %s, %s)""",
                row
            )
            records_written += 1

    conn.commit()

    log(f'\nLoading complete: {records_written} records written to requests')

    cur.close()
    conn.close()

    # finish up
    views.refresh()
    info.update()

    if Picklecache.ENABLED:
        cache.clean()
