from os.path import join, dirname
from configparser import ConfigParser

SETTINGS_FILE = join(dirname(__file__), '../settings.cfg')
EXAMPLE_FILE = join(dirname(__file__), '../settings.example.cfg')


if __name__ == '__main__':
    """
    For each key in the settings.example.cfg file, check if
    the key also exists in the settings.cfg file. If not, update
    the settings.cfg file to add the key.

    If the settings.cfg file doesn't exist, it will be created
    as a copy of settings.example.cfg.
    """

    settings = ConfigParser()
    settings.optionxform = str
    settings.read(SETTINGS_FILE)

    example = ConfigParser()
    example.optionxform = str
    example.read(EXAMPLE_FILE)

    update = False
    for section in example:
        if section == 'DEFAULT':
            continue

        if not settings.has_section(section):
            settings.add_section(section)
            update = True

        for key in example[section]:
            if key not in settings[section]:
                settings.set(section, key, example[section][key])
                update = True

    if update:
        with open(SETTINGS_FILE, 'w') as f:
            settings.write(f)

    # TEMPORARY CODE: migrate dev DBs to new format
    import sys
    import os
    import time
    sys.path.append(os.getcwd())
    import db

    try:
        time.sleep(1)
        db.exec_sql('SELECT * FROM requests LIMIT 1')
    except Exception:
        print("""
Hey guys, I needed to change some database stuff so we're running
an ingest for 2020. If you want more data than that, set YEARS in
server/settings.cfg to whatever years you want, and then run:

docker exec -it 311-backend /bin/bash
python ingest.py

Thanks! Jake

P.S. this should take 5 to 10 minutes, and then the server will start.
        """)
        db.exec_sql('DROP TABLE IF EXISTS ingest_staging_table CASCADE')
        db.reset()
        db.requests.add_years([2020])
