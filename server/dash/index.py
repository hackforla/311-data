import glob
import importlib
import logging
import os
import re
import signal

from dash import Dash, html, dcc, callback, Input, Output
# from dash.dependencies import Input, Output

from app import app
from config import DASH_FILES
from config import PRELOAD


server = app.server
logger = logging.getLogger("gunicorn.error")
available_dashboards = []


files = glob.glob(f"{DASH_FILES}/*.py")
files.remove('dashboards/__init__.py')

for file in files:
    file = re.search("([\w]*)(.py)", file)  # noqa
    dash_mod = file.group(1)
    available_dashboards.append(dash_mod)


if PRELOAD:
    logger.log(logging.INFO, f"Installing dashboards: { ', '.join(available_dashboards) }")  # noqa

    for i in available_dashboards:
        module = importlib.import_module(f"{DASH_FILES}.{i}")


# callback to handle requests
@callback(Output('page-content', 'children'),
              Input('url', 'pathname'))
def display_page(pathname):

    last_part = re.search("([\w]*)$", pathname).group(1)  # noqa
    print(last_part)
    # run the dashboard
    if last_part in available_dashboards:
        logger.log(logging.INFO, f"Running dashboard: {last_part}")
        module = importlib.import_module(f"{DASH_FILES}.{last_part}")
        return module.layout

    # terminate/reload the worker (and reload dashboards)
    elif last_part == 'reload':
        logger.log(logging.WARNING, "Report Server reload requested")
        os.kill(os.getpid(), signal.SIGTERM)
        return html.Div('Reloading...', id="reloading-msg", className="dash-reloading")

    # show links to each dashboard
    else:
        logger.log(logging.INFO, "Loading dashboard list")
        return html.Div([
            dcc.Link(dashboard, href=f"/{DASH_FILES}/{dashboard}") for dashboard in available_dashboards  # noqa
        ], className="dash-links")


logger.log(logging.INFO, "Report Server ready")


if __name__ == '__main__':
    app.run_server(debug=True)
