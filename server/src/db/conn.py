from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.sql import text
from config import config


DATABASE_URL = config['Database']['URL']
VERBOSE = False


engine = create_engine(DATABASE_URL)


Session = sessionmaker(bind=engine)


def exec_sql(sql):
    with engine.connect() as conn:
        return conn.execute(text(sql))


if VERBOSE:
    def on_checkout(*args, **kwargs):
        print('process id {} checkout'.format(os.getpid()), flush=True)

    def on_checkin(*args, **kwargs):
        print('process id {} checkin'.format(os.getpid()), flush=True)

    from sqlalchemy import event
    import os
    event.listen(engine, 'checkout', on_checkout)
    event.listen(engine, 'checkin', on_checkin)
