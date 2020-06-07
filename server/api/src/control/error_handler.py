import traceback
from json import dumps
from sanic.response import text
from sanic.handlers import ErrorHandler as EH
from utils.log import log, log_colors
import utils.slack as slack
from settings import Slack


ERROR_CODES = Slack.ERROR_CODES


class ErrorHandler(EH):
    def __init__(self):
        super(ErrorHandler, self).__init__()

    async def default(self, request, exception):
        status_code = getattr(exception, 'status_code', 500)
        trace = traceback.format_exc()

        if ERROR_CODES is not None and status_code in ERROR_CODES:
            await self.send_to_slack(request, trace, status_code)

        if status_code == 400:
            log(f'400 ERROR: {exception}', color=log_colors.WARNING)
            return text(exception, status_code)
        elif status_code == 500:
            log(trace, color=log_colors.FAIL)
            return text(trace, status_code)
        else:
            return super().default(request, exception)

    async def send_to_slack(self, request, trace, status_code):
        if (request.query_string == ''):
            qs = ''
        else:
            qs = '?{}'.format(request.query_string)

        if request.json is None:
            params = ''
        else:
            params = '\n{}'.format(dumps(request.json, indent=2))

        message = f"""
```
{request.method} {request.path}{qs} {params}

{status_code} ERROR
{trace}```
        """

        await slack.send(message)
