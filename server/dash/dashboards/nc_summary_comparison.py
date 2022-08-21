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
results = re.get(API_HOST + DATE_RANGE_REQ_DATA_API_PATH)
data_json = results.json()
api_data_df = pd.json_normalize(data_json)
print(" * Loading complete dataframe from API path: " + DATE_RANGE_REQ_DATA_API_PATH)

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
    return html.Div(children=[
        html.Div(dcc.Dropdown(sorted(list(set(api_data_df["councilName"]))),
                value=" ", id="selected_nc",
                        placeholder="Select a Neighborhood Council..."),
                        style=merge_dict(INLINE_STYLE, {"width": "48.5vw"})),
                html.Div(dcc.Dropdown(value=" ", id="selected_request_types", multi=True,
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
                        "height": "40vh"})),  # for border-radius , add stuff later


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
                 style=merge_dict(INLINE_STYLE, {"width": "48.5vw"})),

def generate_comparison_total_req(output_id):
    """Generates the indicator visual for the 
    total number of requests.

    This function generates the html elements for the 
    indicator visual with matching output_id showing the total number of 
    requests for the comparison dashboard.

    Args:
        output_id: the id corresponding to the dash element in the layout.

    Return:
        Dash html div element containing label and indicator visual.
    """
    return html.Div([
        html.H6("Total Number of Requests", style=CENTER_ALIGN_STYLE),
        html.H1(id=output_id, style=CENTER_ALIGN_STYLE)],
        style=merge_dict(CHART_OUTLINE_STYLE, {"width": "24vw", "height": "16vh"}))


def generate_comparison_num_days(output_id):
    """Generates the indicator visual for the 
    total number of days request spans.

    This function generates the html elements for the 
    indicator visual with matching output_id showing the 
    total number of days request spans for the 
    comparison dashboard.

    Args:
        output_id: the id corresponding to the dash element in the layout.

    Return:
        Dash html div element containing label and indicator visual.
    """
    return html.Div([
        html.H6("Number of Days", style=CENTER_ALIGN_STYLE),
        html.H1(id=output_id, style=CENTER_ALIGN_STYLE)],
        style=merge_dict(CHART_OUTLINE_STYLE, {"width": "24vw", "height": "16vh"}))

def generate_comparison_req_source_bar(output_id):
    """Generates the bar chart visual for the 
    request source in comparison dashboard.

    This function generates the html elements for the 
    bar chart of request sources with matching output_id 
    on the comparison dashboard.

    Args:
        output_id: the id corresponding to the dash element in the layout.

    Return:
        Dash html div element containing request source bar chart.
    """
    return html.Div(dcc.Graph(id=output_id, style={"height": "30vh"}),
         style=merge_dict(CHART_OUTLINE_STYLE, {
             "width": "48.5vw", "height": "30vh"}))

def generate_comparison_line_chart():
    """Generates the line chart visual for the 
    number of requests in comparison dashboard.

    This function generates the html elements for the 
    overlapping line chart for number of requests on the 
    bottom of the comparison dashboard.

    Return:
        Dash html div element containing overlapping line chart.
    """
    return html.Div(dcc.Graph(id="overlay_req_time_line_chart", style={"height": "32vh",
     "width": "97.5vw"}), style=merge_dict(BORDER_STYLE, {
         "height": "32vh", "width": "97.5vw"}))


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
        html.Div(html.Br(), style=DIVIDER_STYLE),
        html.Div(children=[
            generate_summary_pie_chart(),
            generate_summary_histogram()
        ], style=merge_dict(EQUAL_SPACE_STYLE, {"width": "97.5vw"}))
    ]),
    html.Div(html.Br(), style=DIVIDER_STYLE),
    # Neighborhood Council Summarization Dashboard.
    html.Div(children=[html.H2(COMPARISON_DASHBOARD_TITLE)],
             style=merge_dict(CENTER_ALIGN_STYLE, {"height": "5vh"})),
    # Comparison Dropdowns.
    html.Div(children=[
        generate_council_name_dropdown('nc_comp_dropdown'),
        generate_council_name_dropdown('nc_comp_dropdown2')
    ], style=merge_dict(EQUAL_SPACE_STYLE, {"width": "97.5vw", "height": "12vh"})),
    html.Div(html.Br(), style=DIVIDER_STYLE),
    # NC Comparison - Indicator Visuals.
    html.Div(children=[
        html.Div(children=[
            # Indicator Visuals for Total number of requests and the number of
            # days the data spans across.
            generate_comparison_total_req("total_req_card"),
            generate_comparison_num_days("num_days_card")
        ], style=merge_dict(EQUAL_SPACE_STYLE, {"width": "48.5vw"})),
        # Indicator Visuals for Total number of requests and the number of days
        # the data spans across.
        html.Div(children=[
            generate_comparison_total_req("total_req_card2"),
            generate_comparison_num_days("num_days_card2")
        ], style=merge_dict(EQUAL_SPACE_STYLE, {"width": "48.5vw"}))
    ], style=merge_dict(EQUAL_SPACE_STYLE, {"width": "97.5vw"})),
    html.Div(html.Br(), style=DIVIDER_STYLE),
    # NC Comparison -  Request Source Bar Charts.
    html.Div(children=[
        generate_comparison_req_source_bar("req_source_bar_chart"),
        generate_comparison_req_source_bar("req_source_bar_chart2")
    ], style=merge_dict(EQUAL_SPACE_STYLE, {"width": "97.5vw"})),
    html.Div(html.Br(), style=DIVIDER_STYLE),
    # NC Comparison - Number of Requests per day Overlapping line chart.
    generate_comparison_line_chart()
])

# CALLBACK FUNCTIONS.


@callback(
    [Output("selected_request_types", "options")],
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
    if not selected_nc:
        df = api_data_df
    else:
        df = api_data_df[api_data_df["councilName"] == selected_nc]

    req_types = sorted(list(set(df["typeName"])))
    return req_types


def generate_filtered_dataframe(api_data_df, selected_nc, selected_request_types):
    """Outputs the filtered dataframe based on the selected filters

    This function takes the original dataframe "api_data_df", selected neighborhood
    council "selected_nc", as well as the selected request type "selected_request_types" 
    to output a dataframe with matching records.

    Args:
        api_data_df: full 311-request data directly access from the 311 data API.
        selected_nc: A string argument automatically detected by Dash callback 
        function when "selected_nc" element is selected in the layout.
        selected_request_types: A list of strings automatically detected by Dash 
        callback function when "selected_request_types" element is selected in the
         layout, default None.
    Returns:
        pandas dataframe filtered by selected neighborhood council and request types
    """
    if not selected_nc:
        df = api_data_df
    else:
        df = api_data_df[api_data_df["councilName"] == selected_nc]
    # Filter as per selection on Request Type Dropdown.
    if not selected_request_types and not selected_nc:
        df = api_data_df
    elif selected_request_types:
        df = df[df["typeName"].isin(selected_request_types)]
    return df

def add_datetime_column(df, colname):
    """Adds a datetime column to a dataframe.

    This function takes a datetime column 'colname' in string type, remove the last 4 characters,
    split date and time by character 'T', and finally combine date and time into a single string again.
    The function then converts the string using pandas's to_datetime function.

    Args:
        df: dataframe to add the datetime column to.
        colname: the datetime column that is in string type.
    
    Return:
        A dataframe with new column 'colnameDT' that is in datetime type.
    """
    df.loc[:, colname+"DT"] = pd.to_datetime(
        df.loc[:, colname].str[:-4].str.split("T").str.join(" "))
    return df

def filter_bad_quality_data(df, data_quality_switch=True):
    """Filters the dataframe based on pre-defined data quality filters.

    This function takes the original dataframe "df" and filters out records 
    with an outlier amount of request time to close based on the Freedman-Diaconis Rule.
    Generally 10% of data is excluded.

    Args:
        df: 311-request data accessed from the API.
        data_quality_switch: A boolean argument automatically detected by Dash. 
            callback function when "data_quality_switch" toggle element is selected in layout.
        
    Returns:
        df: filtered dataframe excluding outliers.
        num_bins: the number of bins that will be used to plot histogram.
        data_quality_output: a string being displayed on whether the data quality switch is on or off.
    """
    print("* Getting quality data.")
    df = add_datetime_column(df, "createdDate")
    df = add_datetime_column(df, "closeDate")
    df.loc[:, "timeToClose"] = (df.loc[:, "closeDateDT"] - df.loc[:, "createDateDT"]).dt.days

    # Calculate the Optimal number of bins based on Freedman-Diaconis Rule.

    # Replace empty rows with 0.0000001 To avoid log(0) error later.
    df.loc[:, "timeToClose"] = df.loc[:, "timeToClose"].fillna(0.0000001)

    # Replace negative values
    df = df[df["timeToClose"] > 0]
    if df.shape[0] == 0:
        raise PreventUpdate()

    # Data Quality switch to remove outliers as defined by Median +- 1.5*IQR.
    if data_quality_switch:
        num_bins = len(np.histogram_bin_edges(df.loc[:, "timeToClose"], bins='fd'))-1

        # Log Transform, Compute IQR, then exclude outliers.
        df.loc[:, "logTimeToClose"] = np.log(df.loc[:, "timeToClose"])
        log_q3, log_q1 = np.percentile(df.loc[:, "logTimeToClose"], [75, 25])
        log_iqr = log_q3 - log_q1
        filtered_df = df[(df.loc[:, "logTimeToClose"] > 1.5 * log_iqr - np.median(
            df.loc[:, "logTimeToClose"])) and
            (df.loc[:, "logTimeToClose"] < 1.5 * log_iqr + np.median(
                df.loc[:, "logTimeToClose"]))]
        if filtered_df.shape[0] > 0:
            df = filtered_df
        data_quality_output = "Quality Filter: On"
    else:
        data_quality_output = "Quality Filter: Off"
    return df, num_bins, data_quality_output


@callback(
    Output("req_type_pie_chart", "figure"),
    Input("selected_nc", "value"),
    [Input("selected_request_types", "value")]
)
def generate_req_type_pie_chart(selected_nc, selected_request_types=None):
    """Generates the request type pie chart based on selected filters.

    This callback function takes the selected neighborhood council (nc) value
    from the "selected_nc" dropdown, selected request type from "selected_request_types"
    dropdown to output a pie chart showing the share of request types.

    Args:
        selected_nc: A string argument automatically detected by Dash callback function
             when "selected_nc" element is selected in the layout.
        selected_request_types: A list of strings automatically detected by Dash callback 
            function when "selected_request_types" element is selected in the layout, default None.
    Returns:
        pie chart showing the share of each request type.
    """
    df = generate_filtered_dataframe(api_data_df, selected_nc, selected_request_types)

    # Pie Chart for the distribution of Request Types.
    print(" * Generating requests types pie chart")
    req_type = pd.DataFrame(df["typeName"].value_counts())
    req_type = req_type.reset_index()
    req_type_pie_chart = px.pie(req_type, values="typeName", names="index",
                             title="Share of each Request Type")
    req_type_pie_chart.update_layout(margin=dict(l=50, r=50, b=50, t=50),
                                  legend_title=dict(font=dict(size=10)), font=dict(size=9))
    return req_type_pie_chart


@callback(
    Output("time_close_histogram", "figure"),
    Output("data_quality_output", "children"),
    Input("selected_nc", "value"),
    [Input("selected_request_types", "value")],
    Input("data_quality_switch", "value")
)
def generate_time_to_close_histogram(selected_nc, selected_request_types=None,
data_quality_switch=True):
    """Generates the request type pie chart based on selected filters.

    This callback function takes the selected neighborhood council (nc) 
    value from the "selected_nc" dropdown, selected request type from "selected_request_types"
    dropdown to output a histogram for the time it takes for each request to close.

    Args:
        selected_nc: A string argument automatically detected by Dash callback 
            function when "selected_nc" element is selected in the layout.
            selected_request_types: A list of strings automatically detected by Dash 
            callback function when "selected_request_types" element is selected in the
            layout, default None.
        data_quality_switch: A boolean for data quality filter automatically detected 
            by Dash callback function when "data_quality_switch" element is selected in 
            the layout, default True.
    Returns:
        time_close_histogram: histogram showing the distribution of the request time to close.
        data_quality_output: A string stating the status of the data quality filter 
            ("Quality Filter: On" or "Quality Filter: Off").
    """
    df = generate_filtered_dataframe(api_data_df, selected_nc, selected_request_types)
    df, num_bins, data_quality_output = filter_bad_quality_data(df, data_quality_switch)

    # Distribution for the total number of requests.
    print(" * Generating requests time to close histogram")
    time_close_histogram = px.histogram(df, x="timeToClose",
    title="Distribution of Time to Close Request",
     nbins=num_bins, range_x=[min(
         df.loc[:, "timeToClose"]), max(df.loc[:, "timeToClose"])],
        labels={"timeToClose": "Request Duration",
         "count": "Frequency"})
    time_close_histogram.update_layout(margin=dict(l=50, r=50, b=50, t=50), font=dict(size=9))
    return time_close_histogram, data_quality_output


@callback(
    Output("num_req_line_chart", "figure"),
    Input("selected_nc", "value"),
    [Input("selected_request_types", "value")],
    Input("data_quality_switch", "value")
)
def generate_overlap_req_line_charts(selected_nc, selected_request_types=None,
data_quality_switch=True):
    """Generates the summary visualizations for LA 311 requests data based 
    on selected neighborhood conucil, request types, and data quality switch.

    This function takes the selected neighborhood council (nc) value from the
     "selected_nc" dropdown, selected request type from "selected_request_types"
    dropdown, and the status on the "data_quality_switch" toggle to output a 
    line chart showing request overtime.

    Args:
        selected_nc: A string argument automatically detected by Dash callback
            function when "selected_nc" element is selected in the layout.
        selected_request_types: A list of strings automatically detected by Dash 
            callback function when "selected_request_types" element is selected in the 
            layout, default None.
        data_quality_switch: A boolean for data quality filter automatically 
            detected by Dash callback function when "data_quality_switch" element
             is selected in the layout, default True.
    Returns: 
        Line chart showing the number of requests throughout the day.
    """
    df = generate_filtered_dataframe(api_data_df, selected_nc, selected_request_types)
    df, _, _ = filter_bad_quality_data(df, data_quality_switch)

    # Time Series for the Total Number of Requests.
    print(" * Generating number of requests line chart")
    req_time = pd.DataFrame(df.groupby("createDateDT", as_index=False)["srnumber"].count())
    num_req_line_chart = px.line(req_time, x="createDateDT", y="srnumber",
    title="Total Number of 311 Requests Overtime", labels={
        "createDateDT": "DateTime", "srnumber": "Frequency"})
    num_req_line_chart.update_layout(margin=dict(l=25, r=25, b=25, t=50), font=dict(size=9))
    return num_req_line_chart


def generate_comparison_filtered_df(api_data_df, selected_nc):
    """Generates the dataframe based on selected neighborhood council.

    This function takes the selected neighborhood council (nc) value from 
    the "selected_nc" dropdown and outputs a dataframe 
    corresponding to their neighorhood council with additional datetime column.

    Args:
        api_data_df: full 311-request data directly access from the 311 data API.
        selected_nc: A string argument automatically detected by Dash callback
         function when "nc_comp_dropdown" element is selected in the layout.

    Returns: 
        Pandas dataframe with requests from the nc selected by nc_comp_dropdown.
    """
    if not selected_nc:
        df = api_data_df
    else:
        df = df[df["councilName"] == selected_nc]
    df = add_datetime_column(df, "createdDate")
    return df

@callback(
    Output("req_source_bar_chart", "figure"),
    Output("req_source_bar_chart2", "figure"),
    Input("nc_comp_dropdown", "value"),
    Input("nc_comp_dropdown2", "value"),
    prevent_initial_call=True
)
def generate_req_source_bar_charts(nc_comp_dropdown, nc_comp_dropdown2):
    """Generates a pair of request source bar chart based on the two
     neighborhood council dropdown.

    This function takes the first selected neighborhood council (nc)
     value from the "nc_comp_dropdown" dropdown and second selected 
     neighborhood council value from "nc_comp_dropdown2"
    dropdown and output a pair of request_source bar charts.

    Args:
        nc_comp_dropdown: A string argument automatically detected 
            by Dash callback function when "nc_comp_dropdown" element 
            is selected in the layout.
        nc_comp_dropdown2: A string argument automatically detected by
         Dash callback function when "nc_comp_dropdown2" element is 
         selected in the layout.

    Returns: 
        req_source_bar_chart: bar chart showing the number of request
             from each source for the first neighborhood council 
             (e.g. mobile, app, self-report...etc).
        req_source_bar_chart2: bar chart showing the number of request
         from each source for the second neighborhood council
          (e.g. mobile, app, self-report...etc).
    """
    df_nc1 = generate_comparison_filtered_df(api_data_df, nc_comp_dropdown)
    df_nc2 = generate_comparison_filtered_df(api_data_df, nc_comp_dropdown2)
    # Bar chart of different Request Type Sources for first selected neigbhorhood council.
    req_source = pd.DataFrame(df_nc1["sourceName"].value_counts())
    req_source = req_source.reset_index()
    req_source_bar_chart = px.bar(req_source, x="sourceName", y="index",
    orientation="h", title="Number of Requests by Source", labels={
        "index": "Request Source", "sourceName": "Frequency"})
    req_source_bar_chart.update_layout(margin=dict(l=25, r=25, b=25, t=50), font=dict(size=9))

    # Bar chart of different Request Type Sources for second selected neigbhorhood council.
    req_source2 = pd.DataFrame(df_nc2["sourceName"].value_counts())
    req_source2 = req_source2.reset_index()
    req_source_bar_chart2 = px.bar(req_source2, x="sourceName", y="index",
    orientation="h", title="Number of Requests by Source", labels={
        "index": "Request Source", "sourceName": "Frequency"})
    req_source_bar_chart2.update_layout(margin=dict(l=25, r=25, b=25, t=50), font=dict(size=9))

    return req_source_bar_chart, req_source_bar_chart2


@callback(
    Output("total_req_card", "children"),
    Output("total_req_card2", "children"),
    Output("num_days_card", "children"),
    Output("num_days_card2", "children"),
    Input("nc_comp_dropdown", "value"),
    Input("nc_comp_dropdown2", "value"),
    prevent_initial_call=True
)
def generate_indicator_visuals(nc_comp_dropdown, nc_comp_dropdown2):
    """Generates the overlapping line chart based on selected filters.

    This function takes the the two neighborhood council (nc) value from 
    the "nc_comp_dropdown" dropdown and second selected neighborhood 
    council value from "nc_comp_dropdown2"
    dropdown and outputs indicator visuals for the two nc's.

    Args:
        nc_comp_dropdown: A string argument automatically detected by 
        Dash callback function when "nc_comp_dropdown" element is 
        selected in the layout.
        nc_comp_dropdown2: A string argument automatically detected by
         Dash callback function when "nc_comp_dropdown2" element is 
         selected in the layout.

    Returns: 
        total_req_card: integer for the the total number of request 
            in first selected neigborhood council.
        total_req_card2: integer for the total number of requests 
            in the second selected neighborhood council.
        num_days_card: integer for the total number of days the data 
            available in first selected neighborhood council span.
        num_days_card2: integer for the total number of days the data
            available in second selected neighborhood council span.
    """
    df_nc1 = generate_comparison_filtered_df(api_data_df, nc_comp_dropdown)
    df_nc2 = generate_comparison_filtered_df(api_data_df, nc_comp_dropdown2)
    # Total number of requests for first neigbhorhood council.
    total_req_card = df_nc1.shape[0]

    # Total number of requests for second neigbhorhood council.
    total_req_card2 = df_nc2.shape[0]

    # Total number of days the available requests in first neigbhorhood council span.
    num_days_card = np.max(df_nc1["createDateDT"].dt.day) - \
                           np.min(df_nc1["createDateDT"].dt.day) + 1

    # Total number of days the available requests in second neigbhorhood council span.
    num_days_card2 = np.max(df_nc2["createDateDT"].dt.day) - \
                            np.min(df_nc2["createDateDT"].dt.day) + 1

    return total_req_card, total_req_card2, num_days_card, num_days_card2


@callback(
    Output("overlay_req_time_line_chart", "figure"),
    Input("nc_comp_dropdown", "value"),
    Input("nc_comp_dropdown2", "value"),
    prevent_initial_call=True
)
def generate_overlay_line_chart(nc_comp_dropdown, nc_comp_dropdown2):
    """Generates the overlapping line chart based on selected filters.

    This function takes the the two neighborhood council (nc) value 
    from the "nc_comp_dropdown" dropdown and second selected 
    neighborhood council value from "nc_comp_dropdown2"
    dropdown and outputs a overlapping line chart.

    Args:
        nc_comp_dropdown: A string argument automatically detected 
        by Dash callback function when "nc_comp_dropdown" element 
        is selected in the layout.
        nc_comp_dropdown2: A string argument automatically detected 
        by Dash callback function when "nc_comp_dropdown2" element 
        is selected in the layout.

    Returns: 
        Line chart showing the number of requests throughout the 
        day for both first and second selected neighborhood council.
    """
    df_nc1 = generate_comparison_filtered_df(api_data_df, nc_comp_dropdown)
    df_nc2 = generate_comparison_filtered_df(api_data_df, nc_comp_dropdown2)
    # Overlapping line chart for number of request throughout the day
    # for both first and second neighborhood council.
    req_time = pd.DataFrame(df_nc1.groupby("createDateDT", as_index=False)["srnumber"].count())
    req_time2 = pd.DataFrame(df_nc2.groupby("createDateDT", as_index=False)["srnumber"].count())
    overlay_req_time_line_chart = go.Figure()
    overlay_req_time_line_chart.add_trace(go.Scatter(
        x=req_time["createDateDT"], y=req_time["srnumber"], mode="lines", name="NC1"))
    overlay_req_time_line_chart.add_trace(go.Scatter(
        x=req_time2["createDateDT"], y=req_time2["srnumber"], mode="lines", name="NC2"))

    overlay_req_time_line_chart.update_layout(title="Number of Request Throughout the Day",
     margin=dict(l=25, r=25, b=35, t=50), xaxis_range=[min(
         min(req_time["createDateDT"]), min(req_time2["createDateDT"])),
         max(max(req_time["createDateDT"]), max(req_time2["createDateDT"]))], font=dict(size=9))
    return overlay_req_time_line_chart


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
        df = api_data_df

    # Calculating the average number of requests throughout the day.
    neighborhood_sum_df = df[df.council_name == selected_nc].groupby(["created_date"]).agg("sum").reset_index()  # noqa
    total_sum_df = df.groupby(["created_date"]).agg("sum").reset_index()
    total_sum_df["nc_avg"] = total_sum_df["counts"] / 99
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
