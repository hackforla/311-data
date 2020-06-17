import sys
import time
from sqlalchemy import create_engine, event, exc
from sqlalchemy.orm import sessionmaker
from sqlalchemy.sql import text
from settings import Database
from utils.log import log, log_colors


def get_engine(url):
    ATTEMPTS = 5
    DELAY = 3

    def fail(message):
        log(message, color=log_colors.FAIL)
        sys.exit(1)

    if url is None:
        fail('No database url. Check your environment.')

    try:
        engine = create_engine(url)
    except Exception:
        fail('Invalid database url. Check your environment.')
    else:
        attempt = 0
        while True:
            try:
                with engine.connect():
                    pass
            except Exception:
                if attempt < ATTEMPTS:
                    log(f'Could not connect to DB, retrying in {DELAY}')
                    time.sleep(DELAY)
                    attempt += 1
                    continue

                fail('Cannot connect to database.')
            else:
                return engine


engine = get_engine(Database.URL)


Session = sessionmaker(bind=engine)


def exec_sql(sql):
    try:
        with engine.connect() as conn:
            return conn.execute(text(sql))
    except exc.OperationalError as e:
        log(e, color=log_colors.FAIL)


if Database.LOG_QUERIES:
    event.listen(
        engine,
        'before_cursor_execute',
        lambda conn, cursor, statement, parameters, context, executemany:
            print(statement))


if Database.LOG_CONNECTIONS:
    import os

    def on_checkout(*args, **kwargs):
        print('process id {} checkout'.format(os.getpid()), flush=True)

    def on_checkin(*args, **kwargs):
        print('process id {} checkin'.format(os.getpid()), flush=True)

    event.listen(engine, 'checkout', on_checkout)
    event.listen(engine, 'checkin', on_checkin)
