import os
from os.path import join, dirname
import re
from configparser import ConfigParser, BasicInterpolation
import json

SETTINGS_FILE = join(dirname(__file__), '../settings.cfg')


class CustomInterpolation(BasicInterpolation):
    def before_get(self, parser, section, option, value, defaults):
        # TODO: need better way to handle this
        if section == 'Ingestion' and option == 'YEARS':
            return [int(year) for year in value.split(',')]

        # use environment variable if value looks like this: __$VAR_NAME__
        # print warning and return None if the variable is not defined
        # in the environment
        match = re.match(r"^__\$(.*?)__$", value)
        if match is not None:
            env_var = match.group(1)
            if env_var in os.environ:
                value = os.environ[env_var]
            else:
                print(f'WARNING: ${env_var} is not defined in the environment')
                return None

        # detect value types
        if value == 'None' or value == '':
            return None
        if value.lower() == 'true':
            return True
        if value.lower() == 'false':
            return False
        try:
            return int(value)
        except Exception:
            pass
        try:
            return float(value)
        except Exception:
            pass
        return value


def get_config():
    config = ConfigParser(interpolation=CustomInterpolation())
    config.optionxform = str  # don't lowercase the keys
    config.read(SETTINGS_FILE)
    return config


def print_config(config):
    conf = {section: dict(config[section]) for section in config.sections()}
    print(json.dumps(conf, indent=2))
