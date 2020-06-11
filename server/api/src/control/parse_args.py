from sanic.exceptions import ServerError
import pandas as pd


class to:
    class opt:
        INT = 'INT'
        LIST_OF_INT = 'LIST_OF_INT'
        LIST_OF_STR = 'LIST_OF_STR'
        DICT_OF_INT = 'DICT_OF_INT'
        DICT_OF_FLOAT = 'DICT_OF_FLOAT'

    class req:
        STR = 'STR'
        DATE = 'DATE'
        COMPARISON_SET = 'COMPARISON_SET'

    def error(message, code=400):
        raise ServerError(message, status_code=code)

    def parse_arg(value, to_type):
        if to_type == to.opt.INT:
            return int(value)

        elif to_type == to.opt.LIST_OF_INT:
            return [int(item) for item in value]

        elif to_type == to.opt.LIST_OF_STR:
            return [str(item) for item in value]

        elif to_type == to.opt.DICT_OF_INT:
            return {key: int(val) for key, val in value.items()}

        elif to_type == to.opt.DICT_OF_FLOAT:
            return {key: float(val) for key, val in value.items()}

        elif to_type == to.req.STR:
            return str(value)

        elif to_type == to.req.DATE:
            return pd.to_datetime(value)

        elif to_type == to.req.COMPARISON_SET:
            if value.get('district') not in ['nc', 'cc']:
                raise Exception('district must be either "nc" or "cc".')

            return {
                'district': value['district'],
                'list': [int(item) for item in value['list']]}

    def parse(args, expected_args, to_camel=False):
        out = {}

        for expected, to_type in expected_args.items():
            if expected not in args:
                if hasattr(to.req, to_type):
                    to.error(f'{expected} is required.')
                else:
                    continue
            try:
                out[expected] = to.parse_arg(args[expected], to_type)
            except Exception:
                to.error(f'{expected} could not be parsed to {to_type}.')

        return out
