import datetime
import dash_daq as daq
import numpy as np
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import requests as re

from config import API_HOST
from design import DISCRETE_COLORS, LABELS
from dash import dcc, html, callback
from dash.dependencies import Input, Output
from dash.exceptions import PreventUpdate

# Setting 1 week worth of data.
start_date = datetime.date.today() - datetime.timedelta(days=8)
end_date = datetime.date.today() - datetime.timedelta(days=1)

# Loading the dataframe with the 311 Data API.
DATE_RANGE_REQ_DATA_API_PATH = f"/requests/updated?start_date={start_date}&end_date={end_date}"
print(" * Downloading data for dataframe from API path: " + DATE_RANGE_REQ_DATA_API_PATH)
REPORT_API_PATH = '/reports?field=type_name&field=council_name&field=created_date'
print(" * Downloading data for dataframe from API path: " + REPORT_API_PATH)
results = re.get(API_HOST + DATE_RANGE_REQ_DATA_API_PATH)
data_json = results.json()
api_data_df = pd.json_normalize(data_json)
print(" * Loading complete dataframe from API path: " + DATE_RANGE_REQ_DATA_API_PATH)
report_json = pd.read_json(API_HOST + REPORT_API_PATH)
print(" * Loading complete dataframe from API path: " + REPORT_API_PATH)

print("wtf")


def merge_dict(d1, d2):
    """Merges two dictionary and return the results.
    This function takes in two dictionary and return
    the result of merging the two.
    Args:
        d1: first dictionary.
        d2: second dictionary.
    Return:
        a dictionary containing all key-value pairs from d1 and d2.
    """
    return {**d1, **d2}


# LAYOUT VARIABLES.
BORDER_STYLE = {"border": "0.5px black solid"}
CENTER_ALIGN_STYLE = {"text-align": "center"}
DIVIDER_STYLE = {"height": "1vh"}
EQUAL_SPACE_STYLE = {"display": "flex", "justify-content": "space-between"}
INLINE_STYLE = {"display": "inline-block"}
CHART_OUTLINE_STYLE = merge_dict(INLINE_STYLE, BORDER_STYLE)
SUMMARY_DASHBOARD_TITLE = "LA 311 Requests - Neighborhood Council Summary Dashboard"
COMPARISON_DASHBOARD_TITLE = "LA 311 Requests - Neighborhood Council Comparison Dashboard"


def generate_summary_dropdowns():
    """Generates the dropdowns for the summary dashboard.
    This function generates the html elements for the 
    neighborhood council and request type dropdowns for summary dashboard.
    Return:
        Dash html div element containing nc and request type dropdowns.
    """
    councils = sorted(list(set(api_data_df["councilName"])))
    return html.Div(children=[
        html.Div(dcc.Dropdown(councils, councils[0], id="selected_nc",
                        placeholder="Select a Neighborhood Council..."),
                        style=merge_dict(INLINE_STYLE, {"width": "48.5vw"})),
        html.Div(dcc.Dropdown(id="selected_request_types", multi=True,
                placeholder="Select a Request Type..."),
                style=merge_dict(INLINE_STYLE, {"width": "48.5vw"}))
    ], style=merge_dict(EQUAL_SPACE_STYLE, {"width": "97.5vw", "height": "10vh"}))


# LAYOUT.
layout = html.Div([
    html.Div(children=[
        # Neighborhood Council Dashboard.
        # generate_summary_header(),
        # Summary Dropdown.
        generate_summary_dropdowns(),
        # html.Div(html.Br(), style={"height": "0.5vh"}),
        # Line Chart for Number of Request throughout the day.
        # generate_summary_line_chart(),
    ]),
])

# CALLBACK FUNCTIONS.


@callback(
    [Output("selected_request_types", "options"),
    Output("selected_request_types", "value")],
    Input("selected_nc", "value")
)
def generate_dynamic_filter(selected_nc):
    """Enables the dashboard to show dynamic filters.
    This function takes the selected neighborhood council (nc) value from the 
    "selected_nc" dropdown and output a a list of available request types
    from that neigbhorhood council.
    Args:
        selected_nc: A string argument automatically detected by Dash callback 
        function when "selected_nc" element is selected in the layout.
    Returns: 
        selected_request_types: a list of request types available from the selected 
        neigbhorhood council.
    """
    # If no neighborhood council is selected, use all data.
    print("got new selected_nc ", selected_nc)
    if not selected_nc:
        df = api_data_df
    else:
        df = api_data_df[api_data_df["councilName"] == selected_nc]

    req_types = sorted(list(set(df["typeName"])))
    return req_types, ' '
