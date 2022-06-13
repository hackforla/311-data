import json
import urllib

from dash import Dash, html, dcc
import pandas as pd


external_stylesheets = ['/static/reports.css']
app = Dash(__name__, external_stylesheets=external_stylesheets)

# set up default layout
app.layout = html.Div([
    dcc.Location(id='url', refresh=False),
    html.Div(id='page-content')
])

server = app.server
app.config.suppress_callback_exceptions = True

BATCH_SIZE = 10000


def batch_get_data(url):
    # set up your query
    if '?' in url:
        batch_url = f"{url}&limit={BATCH_SIZE}"
    else:
        batch_url = f"{url}?limit={BATCH_SIZE}"

    response_size = BATCH_SIZE
    result_list = []
    skip = 0

    # loop through query results and add to a list (better performance!)
    while (response_size == BATCH_SIZE):
        batch = json.loads(urllib.request.urlopen(f"{batch_url}&skip={skip}").read())
        result_list.extend(batch)
        response_size = len(batch)
        skip = skip + BATCH_SIZE

    # convert JSON object list to dataframe
    df = pd.DataFrame.from_records(result_list)

    return df
