from utils.database import db
from utils.log import log


def clean_download_table():
    log('\nCleaning download table')

    # drop duplicates
    res = db.exec_sql(f"""
        DELETE FROM download a USING download b
        WHERE a.id < b.id AND a.srnumber = b.srnumber;
    """)
    log(f'\tDropped duplicate rows by srnumber: {res.rowcount} rows')

    # switch primary key
    db.exec_sql(f"""
        ALTER TABLE download DROP COLUMN id;
        ALTER TABLE download ADD PRIMARY KEY (srnumber);
    """)
    log(f'\tSwitched primary key column to srnumber')

    # remove invalid closed dates
    res = db.exec_sql(f"""
        UPDATE download
        SET closeddate = NULL
        WHERE closeddate::timestamp < createddate::timestamp;
    """)
    log(f'\tRemoved invalid closed dates: {res.rowcount} rows')

    # set _daystoclose
    res = db.exec_sql(f"""
      UPDATE download
      SET _daystoclose = EXTRACT (
          EPOCH FROM
          (closeddate::timestamp - createddate::timestamp) /
          (60 * 60 * 24)
      );
    """)
    log(f'\tSet _daystoclose column: {res.rowcount} rows')

    # fix North Westwood
    res = db.exec_sql(f"""
      UPDATE download
      SET nc = 127
      WHERE nc = 0 AND ncname = 'NORTH WESTWOOD NC'
    """)
    log(f'\tFixed nc code for North Westwood NC: {res.rowcount} rows')

    # fix Historic Cultural North
    res = db.exec_sql(f"""
      UPDATE download
      SET nc = 128
      WHERE nc = 0 AND ncname = 'HISTORIC CULTURAL NORTH NC'
    """)
    log(f'\tFixed nc code for Historic Cultural North NC: {res.rowcount} rows')
