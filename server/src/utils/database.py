from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.sql import text
from config import config, print_config


class Database(object):
    def __init__(self, verbose=False):
        database_url = config['Database']['URL']
        if database_url is None:
            return

        self.engine = create_engine(database_url)
        self.Session = sessionmaker(bind=self.engine)

        if verbose:
            self.log_connection_events()

    def exec_sql(self, sql):
        with self.engine.connect() as conn:
            return conn.execute(text(sql))

    def log_connection_events(self):
        def on_checkout(*args, **kwargs):
            print('process id {} checkout'.format(os.getpid()), flush=True)

        def on_checkin(*args, **kwargs):
            print('process id {} checkin'.format(os.getpid()), flush=True)

        from sqlalchemy import event
        import os
        event.listen(self.engine, 'checkout', on_checkout)
        event.listen(self.engine, 'checkin', on_checkin)


db = Database()
