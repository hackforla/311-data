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


def generate_summary_header():
    """Generates the header for the summary dashboard.
    This function generates the html elements for the 
    title and data quality toggle for summary dashboard.
    Return:
        Dash html div element containing title and data 
        quality toggle.
    """
    return html.Div(children=[
        html.H2(SUMMARY_DASHBOARD_TITLE, style={"vertical-align": "middle"}),
        html.Div([daq.ToggleSwitch(id="data_quality_switch", value=True,
            style={"height": "0.5vh"}, size=35),
            html.Div(id="data_quality_output")], style={"font-family": "Open Sans"})
    ], style=merge_dict(EQUAL_SPACE_STYLE, {"vertical-align": "middle",
        "height": "5vh", "width": "97.5vw"}))


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


def generate_summary_line_chart():
    """Generates the line chart for the summary dashboard.
    This function generates the html elements for the 
    number of requests line chart for summary dashboard.
    Return:
        Dash html div element containing overlapping line chart.
    """
    return html.Div(dcc.Graph(id="nc_avg_comp_line_chart", style={"height": "40vh",
         "width": "97.4vw"}),
        style=merge_dict(BORDER_STYLE, {"height": "40vh", "width": "97.4vw"}))


def generate_summary_pie_chart():
    """Generates the pie chart for the summary dashboard.
    This function generates the html elements for the 
    request type pie chart for summary dashboard.
    Return:
        Dash html div element containing request type pie chart.
    """
    return html.Div(
        dcc.Graph(
            id="req_type_pie_chart", style={"height": "40vh",
                            "width": "48.5vw"}
        ), style=merge_dict(CHART_OUTLINE_STYLE, {"width": "48.5vw",
                        "height": "40vh"}))  # for border-radius , add stuff later


def generate_summary_histogram():
    """Generates the histogram for the summary dashboard.
    This function generates the html elements for the 
    request time to close histogram for summary dashboard.
    Return:
        Dash html div element containing request time to close histogram.
    """
    return html.Div(
        dcc.Graph(
            id="time_close_histogram", style={"height": "40vh",
                     "width": "48vw"}
        ), style=merge_dict(CHART_OUTLINE_STYLE, {"width": "48vw",
                 "height": "40vh"}))


def generate_council_name_dropdown(output_id):
    """Generates the neighborhood council (nc) dropdown for the 
    comparison dashboard.
    This function generates the html elements for the 
    nc dropdown for the comparison dashboard.
    Args:
        output_id: the id corresponding to the dash element in the layout.
    Return:
        Dash html div element containing nc drop down for left pane filtering.
    """
    return html.Div(dcc.Dropdown(sorted(list(set(api_data_df["councilName"]))),
         value=" ", id=output_id,
                 placeholder="Select a Neighborhood Council..."),
                 style=merge_dict(INLINE_STYLE, {"width": "48.5vw"}))


# LAYOUT.
layout = html.Div([
    html.Div(children=[
        # Neighborhood Council Dashboard.
        generate_summary_header(),
        # Summary Dropdown.
        generate_summary_dropdowns(),
        html.Div(html.Br(), style={"height": "0.5vh"}),
        # Line Chart for Number of Request throughout the day.
        generate_summary_line_chart(),
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


@callback(
    Output("nc_avg_comp_line_chart", "figure"),
    [Input("selected_nc", "value")]
)
def update_line_chart(selected_nc):
    """Generates a line chart visualizations for LA 311 requests data
     based on the two selected neighborhood conucils.
    This function takes the selected neighborhood council (nc) value
     from the "selected_nc" dropdown and output a line chart showing 
    the number of requests throughout the day and the average number 
    of requests throughout the day (total number of requests / all 99 neighborhood councils).
    Args:
        selected_nc: A string argument automatically detected by Dash 
        callback function when "selected_nc" element is selected in the layout.
    Returns: 
        nc_avg_comp_line_chart: line chart showing the number of requests
         throughout the day for the selected neighborhood council and average
    """
    # If dropdown value is empty, use all data available.
    if not selected_nc:
        df = report_json
        selected_nc = 'Total'
    else:
        df = report_json[report_json.council_name == selected_nc]

    # Calculating the average number of requests throughout the day.
    neighborhood_sum_df = df.groupby(["created_date"]).agg("sum").reset_index()  # noqa
    total_sum_df = report_json.groupby(["created_date"]).agg("sum").reset_index()
    total_sum_df["nc_avg"] = total_sum_df["counts"] / 99
    print(total_sum_df)
    merged_df = neighborhood_sum_df.merge(total_sum_df["nc_avg"].to_frame(),
     left_index=True, right_index=True)  # noqa

    nc_avg_comp_line_chart = px.line(
        merged_df,
        x="created_date",
        y=["counts", "nc_avg"],
        color_discrete_sequence=DISCRETE_COLORS,
        labels=LABELS,
        title="Number of " + selected_nc +
        " Requests compared with the average Neighborhood Council"
    )

    nc_avg_comp_line_chart.update_xaxes(
        tickformat="%a\n%m/%d",
    )

    nc_avg_comp_line_chart.update_traces(
        mode="markers+lines"
    )  # add markers to lines.

    return nc_avg_comp_line_chart
