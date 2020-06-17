import inspect
import json
import textwrap
from utils.log import log, log_colors
from utils.parse_env import missing_env_vars
import settings


def settings_as_dict():
    sections = [
        (name, obj)
        for name, obj in inspect.getmembers(settings)
        if inspect.isclass(obj) and name not in ['to']
    ]

    return {
        section: {
            key: value
            for key, value in dict(vars(obj)).items()
            if not key.startswith('_')
        }
        for section, obj in sections
    }


def warn_missing():
    for var in missing_env_vars:
        warning = f'WARNING: {var} is missing in your environment.'
        log(warning, color=log_colors.WARNING)


def log_settings():
    for section, pairs in settings_as_dict().items():
        log(section)
        for key, value in pairs.items():
            if isinstance(value, dict):
                disp = textwrap \
                    .indent(json.dumps(value, indent=2), '\t') \
                    .replace('\t{', '{')
                log(f'\t{key} = {disp}')
            else:
                log(f'\t{key} = {value}')
        log()

    warn_missing()
