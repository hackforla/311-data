from ...conn import exec_sql
from utils.log import log


def clean_table():
    log('\nCleaning staging table')

    # drop duplicates
    res = exec_sql("""
        DELETE FROM stage a USING stage b
        WHERE a.id < b.id AND a.srnumber = b.srnumber;
    """)
    log(f'\tDropped duplicate rows by srnumber: {res.rowcount} rows')

    # switch primary key
    exec_sql("""
        ALTER TABLE stage DROP COLUMN id;
        ALTER TABLE stage ADD PRIMARY KEY (srnumber);
    """)
    log(f'\tSwitched primary key column to srnumber')

    # remove invalid closed dates
    res = exec_sql("""
        UPDATE stage
        SET closeddate = NULL
        WHERE closeddate::timestamp < createddate::timestamp;
    """)
    log(f'\tRemoved invalid closed dates: {res.rowcount} rows')

    # set _daystoclose
    res = exec_sql("""
      UPDATE stage
      SET _daystoclose = EXTRACT (
          EPOCH FROM
          (closeddate::timestamp - createddate::timestamp) /
          (60 * 60 * 24)
      );
    """)
    log(f'\tSet _daystoclose column: {res.rowcount} rows')

    # fix North Westwood
    res = exec_sql("""
      UPDATE stage
      SET nc = 127
      WHERE nc = 0 AND ncname = 'NORTH WESTWOOD NC'
    """)
    log(f'\tFixed nc code for North Westwood NC: {res.rowcount} rows')

    # fix Historic Cultural North
    res = exec_sql("""
      UPDATE stage
      SET nc = 128
      WHERE nc = 0 AND ncname = 'HISTORIC CULTURAL NORTH NC'
    """)
    log(f'\tFixed nc code for Historic Cultural North NC: {res.rowcount} rows')
