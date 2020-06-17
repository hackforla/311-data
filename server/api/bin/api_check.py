import sys
from os.path import join, dirname
sys.path.append(join(dirname(__file__), '../src'))


def check_db_version():
    import db
    from utils.log import log, log_colors

    setup_message = """
        Your database is not set up. Please run:

        docker-compose run api python bin/db_reset.py
    """

    migrate_message = """
        You're running an old version of the database. Please run
        this command to get the latest:

        docker-compose run api python bin/db_migrate.py
    """

    version = db.version()
    latest_version = 0  # will come from the migrate module

    if version == -1:
        log(setup_message, color=log_colors.FAIL, dedent=True)
        sys.exit(1)

    elif version < latest_version:
        log(migrate_message, color=log_colors.FAIL, dedent=True)
        sys.exit(1)

    else:
        log('DB structure OK')


def check_db_update():
    import db
    from datetime import datetime
    from utils.log import log, log_colors

    last_updated = db.info.last_updated()
    time_since_update = datetime.utcnow() - last_updated
    log('DB last updated: {}'.format(last_updated.isoformat()))

    if time_since_update.days > 7:
        update_message = """
            Your database hasn't been updated in a while. If you'd like
            to get the latest Socrata data, open a new terminal and run:

            docker-compose run api python bin/db_update.py"""

        log(update_message, color=log_colors.WARNING, dedent=True)


def show_db_contents():
    import db
    from tabulate import tabulate
    from settings import Socrata

    years = sorted(Socrata.DATASET_IDS.keys())
    info_rows = db.info.rows()['byYear']
    rows = [info_rows.get(year, 0) for year in years]

    print(tabulate({
        'year': years,
        'requests': rows,
    }, tablefmt='psql', headers='keys'))


if __name__ == '__main__':
    from utils.log import log_heading
    import time
    from settings import Server

    time.sleep(1)

    log_heading('checks')
    check_db_version()
    check_db_update()

    # log_heading('database contents')
    # show_db_contents()

    if not Server.UPDATE_ON_START:
        import pb
        if not pb.enabled:
            pb.clear_data()
        elif not pb.available():
            pb.populate()

    from utils.settings import log_settings
    log_heading('settings')
    log_settings()

    log_heading('starting server')
