import logging
import os
import signal

import dash
from dash import html, callback, Input, Output

dash.register_page(__name__)

RELOADING_MESSAGE = "Reloading..."

logger = logging.getLogger("gunicorn.error")

# LAYOUT.
layout = html.Div([
    html.Div(children=[
        html.Div("", id="reloading-msg", className="dash-reloading")
    ]),
])


@callback(
    Output("reloading-msg", "children"),
    Input("url", "pathname")
)
def reload_page(url):
    """Reloads the workers when this page is accessed."""
    del url
    logger.log(logging.WARNING, "Report Server reload requested")
    os.kill(os.getpid(), signal.SIGTERM)
    return RELOADING_MESSAGE
