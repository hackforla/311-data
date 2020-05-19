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
