import os
import sys
from utils.log import log, log_colors


missing_env_vars = []


class to:
    STR = 'str'
    INT = 'int'
    BOOL = 'bool'
    ABS_PATH = 'abs_path'
    LIST_OF_INTS = 'list_of_ints'

    def parse(value, to_type):
        if to_type == to.STR:
            return value

        if to_type == to.BOOL:
            return value == '1'

        if to_type == to.INT:
            return int(value)

        if to_type == to.LIST_OF_INTS:
            return [int(item) for item in value[1:-1].split(',')]

        if to_type == to.ABS_PATH:
            if os.path.isabs(value):
                return value
            else:
                value = os.path.join(os.getcwd(), value)
                return os.path.normpath(value)

        return value


def env(key, to_type=to.STR):
    value = os.environ.get(key)

    if value is None or value == '':
        missing_env_vars.append(key)
        return None

    try:
        return to.parse(value, to_type)
    except Exception:
        message = (
            f'Count not parse {key} to {to_type}. ' +
            'Please check your environment.')
        log(message, color=log_colors.FAIL)
        sys.exit(1)
