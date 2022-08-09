import datetime
import dash_daq as daq
import numpy as np
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import requests as re

from config import API_HOST
from design import DISCRETE_COLORS, LABELS, apply_figure_style
from dash import dcc, html, callback
from dash.dependencies import Input, Output
from dash.exceptions import PreventUpdate

# Setting 1 week worth of data
# TODO: reset back to 1 week worth of data
start_date = datetime.date.today() - datetime.timedelta(days=300)
end_date = datetime.date.today() - datetime.timedelta(days=200)

# Loading the dataframe with the 311 Data API. 
DATE_RANGE_REQ_DATA_API_PATH = f"/requests/updated?start_date={start_date}&end_date={end_date}"
print(" * Downloading data for dataframe from API path: " + DATE_RANGE_REQ_DATA_API_PATH)
results = re.get(API_HOST + DATE_RANGE_REQ_DATA_API_PATH)
data_json = results.json()
data_2020 = pd.json_normalize(data_json)
print(" * Loading complete dataframe from API path: " + DATE_RANGE_REQ_DATA_API_PATH)

# LAYOUT VARIABLES. 
BORDER_STYLE = {"border": "0.5px black solid"}
CENTER_ALIGN_STYLE = {"text-align": "center"}
DIVIDER_STYLE = {"height": "1vh"}
EQUAL_SPACE_STYLE = {"display": "flex", "justify-content": "space-between"}
INLINE_STYLE = {"display": "inline-block"}
CHART_OUTLINE_STYLE = INLINE_STYLE.update(BORDER_STYLE)
SUMMARY_DASHBOARD_TITLE = "LA 311 Requests - Neighborhood Council Summary Dashboard"
COMPARISON_DASHBOARD_TITLE = "LA 311 Requests - Neighborhood Council Comparison Dashboard"

# LAYOUT. 
layout = html.Div([

    html.Div(children=[

        # Neighborhood Council Dashboard.
        html.Div(children=[
            html.H2(SUMMARY_DASHBOARD_TITLE, style={"vertical-align": "middle"}),
            html.Div([daq.ToggleSwitch(id="data_quality_switch", value=True, style={"height": "0.5vh"}, size=35),
            html.Div(id="data_quality_output")], style={"font-family": "Open Sans"})
        ], style=EQUAL_SPACE_STYLE.update({"vertical-align": "middle", "height": "5vh", "width": "97.5vw"})),

        # Summary Dropdown.
        html.Div(children=[
            html.Div(dcc.Dropdown(sorted([n for n in set(data_2020["councilName"])]), " ", id="nc_dropdown",
                     placeholder="Select a Neighborhood Council..."), style=INLINE_STYLE.update({"width": "48.5vw"})),
            html.Div(dcc.Dropdown(id="nc_dropdown_filter", multi=True, placeholder="Select a Request Type..."), 
            style=INLINE_STYLE.update({"width": "48.5vw"}))
        ], style=EQUAL_SPACE_STYLE.update({"width": "97.5vw", "height": "10vh"})),

        html.Div(html.Br(), style={"height": "0.5vh"}),

        # Line Chart for Number of Request throughout the day.
        html.Div(dcc.Graph(id="nc_avg_comp_line_chart", style={"height": "40vh", "width": "97.4vw"}), 
        style=BORDER_STYLE.update({"height": "40vh", "width": "97.4vw"})),

        html.Div(html.Br(), style=DIVIDER_STYLE),

        html.Div(children=[
            html.Div(
                # Pie Chart for the share of request type.
                dcc.Graph(
                    id="req_type_pie_chart", style={"height": "40vh", "width": "48.5vw"}
                ), style=CHART_OUTLINE_STYLE.update({"width": "48.5vw", "height": "40vh"})),  # for border-radius , add stuff later
            html.Div(
                # Histogram for the request timeToClose.
                dcc.Graph(
                    id="time_close_histogram", style={"height": "40vh", "width": "48vw"}
                ), style=CHART_OUTLINE_STYLE.update({"width": "48vw", "height": "40vh"}))
        ], style=EQUAL_SPACE_STYLE.update({"width": "97.5vw"}))

    ]),

    html.Div(html.Br(), style=DIVIDER_STYLE),

    # Neighborhood Council Summarization Dashboard.
    html.Div(children=[html.H2(COMPARISON_DASHBOARD_TITLE)], style=CENTER_ALIGN_STYLE.update({"height": "5vh"})),

    # Comparison Dropdowns.
    html.Div(children=[
        html.Div(dcc.Dropdown(sorted([n for n in set(data_2020["councilName"])]), " ", id="nc_comp_dropdown",
                 placeholder="Select a Neighborhood Council..."), style=INLINE_STYLE.update({"width": "48.5vw"})),
        html.Div(dcc.Dropdown(sorted([n for n in set(data_2020["councilName"])]), " ", id="nc_comp_dropdown2",
                 placeholder="Select a Neighborhood Council..."), style=INLINE_STYLE.update({"width": "48.5vw"})),
    ], style=EQUAL_SPACE_STYLE.update({"width": "97.5vw", "height": "12vh"})),

    html.Div(html.Br(), style=DIVIDER_STYLE),

    # NC Comparison - Indicator Visuals.
    html.Div(children=[
        html.Div(children=[

            # Indicator Visuals for Total number of requests and the number of days the data spans across.
            html.Div([
                html.H6("Total Number of Requests", style=CENTER_ALIGN_STYLE),
                html.H1(id="total_req_card", style=CENTER_ALIGN_STYLE)],
                style=CHART_OUTLINE_STYLE.update({"width": "24vw", "height": "16vh"})),
            html.Div([
                html.H6("Number of Days", style=CENTER_ALIGN_STYLE),
                html.H1(id="num_days_card", style=CENTER_ALIGN_STYLE)],
                style=CHART_OUTLINE_STYLE.update({"width": "24vw", "height": "16vh"}))

        ], style=EQUAL_SPACE_STYLE.update({"width": "48.5vw"})),

        # Indicator Visuals for Total number of requests and the number of days the data spans across.
        html.Div(children=[
            html.Div([
                html.H6("Total Number of Requests", style=CENTER_ALIGN_STYLE),
                html.H1(id="total_req_card2", style=CENTER_ALIGN_STYLE)],
                style=CHART_OUTLINE_STYLE.update({"width": "24vw", "height": "16vh"})),
            html.Div([
                html.H6("Number of Days", style=CENTER_ALIGN_STYLE),
                html.H1(id="num_days_card2", style=CENTER_ALIGN_STYLE)],
                style=CHART_OUTLINE_STYLE.update({"width": "24vw", "height": "16vh"}))

        ], style=EQUAL_SPACE_STYLE.update({"width": "48.5vw"}))
    ], style=EQUAL_SPACE_STYLE.update({"width": "97.5vw"})),

    html.Div(html.Br(), style=DIVIDER_STYLE),

    # NC Comparison -  Request Source Bar Charts.
    html.Div(children=[
        html.Div(dcc.Graph(id="req_source_bar_chart", style={"height": "30vh"}), style=CHART_OUTLINE_STYLE.update({
                 "width": "48.5vw", "height": "30vh"})),
        html.Div(dcc.Graph(id="req_source_bar_chart2", style={"height": "30vh"}), style=CHART_OUTLINE_STYLE.update({
                 "width": "48.5vw", "margin-left": "10px", "height": "30vh"}))
    ], style=EQUAL_SPACE_STYLE.update({"width": "97.5vw"})),

    html.Div(html.Br(), style=DIVIDER_STYLE),

    # NC Comparison - Number of Requests per day Overlapping line chart.
    html.Div(dcc.Graph(id="overlay_req_time_line_chart", style={"height": "32vh", "width": "97.5vw"}), style=BORDER_STYLE.update({
        "height": "32vh", "width": "97.5vw"}))
])

# CALLBACK FUNCTIONS.
@callback(
    [Output("nc_dropdown_filter", "options"),
     Output("nc_dropdown_filter", "value")],
    Input("nc_dropdown", "value")
)
def generate_dynamic_filter(nc_dropdown):
    """Enables the dashboard to show dynamic filters.

    This function takes the selected neighborhood council (nc) value from the "nc_dropdown" dropdown and output a a list of available request types
    from that neigbhorhood council.

    Args:
        nc_dropdown: A string argument automatically detected by Dash callback function when "nc_dropdown" element is selected in the layout.

    Returns: 
        nc_dropdown_filter: a list of request types available from the selected neigbhorhood council.
        nc_dropdown_filter: placeholder value for the dropdown when nothing is selected.
    """
    # If no neighborhood council is selected, use all data.
    if not nc_dropdown:
        df = data_2020
    else:
        df = data_2020[data_2020["councilName"] == nc_dropdown]

    req_types = sorted([n for n in set(df["typeName"])])
    return req_types, " "

def generate_filtered_dataframe(data_2020, nc_dropdown, nc_dropdown_filter):
    """Outputs the filtered dataframe based on the selected filters

    This functions takes the original dataframe "data_2020", selected neighborhood council "nc_dropdown",
    as well as the selected request type "nc_dropdown_filter" to output a dataframe with matching records.
    
    Args:
        data_2020: full 311-request data directly access from the 311 data API.
        nc_dropdown: A string argument automatically detected by Dash callback function when "nc_dropdown" element is selected in the layout.
        nc_dropdown_filter: A list of strings automatically detected by Dash callback function when "nc_dropdown_filter" element is selected in the layout, default None.
    Returns:
        pandas dataframe filtered by selected neighborhood council and request types
    """
    print(" * Generating summary visualizations")
    if not nc_dropdown:
        df = data_2020
    else:
        df = data_2020[data_2020["councilName"] == nc_dropdown]
    # Filter as per selection on Reqquest Type Dropdown.
    if not nc_dropdown_filter and not nc_dropdown:
        df = data_2020
    elif nc_dropdown_filter:
        df = df[df["typeName"].isin(nc_dropdown_filter)]
    return df

def filter_bad_quality_data(df, data_quality_switch=True):
    """Filters the dataframe based on pre-defined data quality filters.

    This functions takes the original dataframe "df" and filters out records with an outlier amount 
    of request time to close based on the Freedman-Diaconis Rule.
    
    Args:
        df: 311-request data accessed from the API.
        data_quality_switch: A string argument automatically detected by Dash callback function when "data_quality_switch" toggle element is selected in layout.
        nc_dropdown_filter: A list of strings automatically detected by Dash callback function when "nc_dropdown_filter" element is selected in the layout, default None.
    Returns:
        df: filtered dataframe excluding outliers.
        num_bins: the number of bins that will be used to plot histogram.
        data_quality_output: a string being displayed on whether the data quality switch is on or off.
    """
    df.loc[:, "createDateDT"] = pd.to_datetime(
        df.loc[:, "createdDate"].str[:-4].str.split("T").str.join(" "))
    df.loc[:, "closeDateDT"] = pd.to_datetime(
        df.loc[:, "closedDate"].str[:-4].str.split("T").str.join(" "))
    df.loc[:, "timeToClose"] = (df.loc[:, "closeDateDT"] - df.loc[:, "createDateDT"]).dt.days

    # Calculate the Optimal number of bins based on Freedman-Diaconis Rule.

    # Replace empty rows with 0.0000001 To avoid log(0) error later.
    df.loc[:, "timeToClose"] = df.loc[:, "timeToClose"].fillna(0.0000001)

    # Replace negative values
    # TODO: figure out what to do when there is no data avaialble. 
    df = df[df["timeToClose"] > 0]
    if df.shape[0] == 0:
        raise PreventUpdate()
    else:
        q3, q1 = np.percentile(df.loc[:, "timeToClose"].astype(int), [75, 25])
        iqr = q3 - q1
        if not iqr:
            num_bins = 100
        else:
            num_bins = int((2 * iqr) / (df.shape[0]**(1 / 3)))

        # Log Transform, Compute IQR, then exclude outliers.
        df.loc[:, "logTimeToClose"] = np.log(df.loc[:, "timeToClose"])
        log_q3, log_q1 = np.percentile(df.loc[:, "logTimeToClose"], [75, 25])
        log_iqr = log_q3 - log_q1

    # Data Quality switch to remove outliers as defined by Median +- 1.5*IQR.
    if data_quality_switch:
        # TODO: figure out what happens when the filtering mechanism output no data at all.
        temp = df[(df.loc[:, "logTimeToClose"] > 1.5 * log_iqr - np.median(df.loc[:, "logTimeToClose"])) &
                   (df.loc[:, "logTimeToClose"] < 1.5 * log_iqr + np.median(df.loc[:, "logTimeToClose"]))]
        if temp.shape[0] > 0:
            df = temp
        data_quality_output = "Quality Filter: On"
    else:
        data_quality_output = "Quality Filter: Off"
    return df, num_bins, data_quality_output

@callback(
    Output("req_type_pie_chart", "figure"),
    Input("nc_dropdown", "value"),
    [Input("nc_dropdown_filter", "value")]
)
def generate_req_type_pie_chart(nc_dropdown, nc_dropdown_filter=None):
    """Generates the request type pie chart based on selected filters.

    This callback function takes the selected neighborhood council (nc) value from the "nc_dropdown" dropdown, selected request type from "nc_dropdown_filter"
    dropdown to output a pie chart showing the share of request types.
    
    Args:
        nc_dropdown: A string argument automatically detected by Dash callback function when "nc_dropdown" element is selected in the layout.
        nc_dropdown_filter: A list of strings automatically detected by Dash callback function when "nc_dropdown_filter" element is selected in the layout, default None.
    Returns:
        pie chart showing the share of each request type.
    """ 
    df = generate_filtered_dataframe(data_2020, nc_dropdown, nc_dropdown_filter)

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
    Output("num_req_line_chart", "figure"),
    Output("data_quality_output", "children"),
    Input("nc_dropdown", "value"),
    [Input("nc_dropdown_filter", "value")],
    Input("data_quality_switch", "value")
)
def generate_nc_summary_charts(nc_dropdown, nc_dropdown_filter=None, data_quality_switch=True):
    """Generates the summary visualizations for LA 311 requests data based on selected neighborhood conucil, request types, and data quality switch.

    This function takes the selected neighborhood council (nc) value from the "nc_dropdown" dropdown, selected request type from "nc_dropdown_filter"
    dropdown, and the status on the "data_quality_switch" toggle to output a 4 main visualizations to provide an overview.

    Args:
        nc_dropdown: A string argument automatically detected by Dash callback function when "nc_dropdown" element is selected in the layout.
        nc_dropdown_filter: A list of strings automatically detected by Dash callback function when "nc_dropdown_filter" element is selected in the layout, default None.
        data_quality_switch: A boolean for data quality filter automatically detected by Dash callback function when "data_quality_switch" element is selected in the layout, default True.

    Returns: 
        req_type_pie_chart: pie chart that shows the share of request types out of all requests.
        time_close_histogram: histogram showing the distribution of time it takes for requests to close.
        num_req_line_chart: line chart showing the number of requests throughout the day.
        data_quality_output: A string stating the status of the data quality filter ("Quality Filter: On" or "Quality Filter: Off").
    """
    df = generate_filtered_dataframe(data_2020, nc_dropdown, nc_dropdown_filter)
    # Distribution of Time to Close Date of each request.
    # Calculate the Time to Closed.
    df.loc[:, "createDateDT"] = pd.to_datetime(
        df.loc[:, "createdDate"].str[:-4].str.split("T").str.join(" "))
    df.loc[:, "closeDateDT"] = pd.to_datetime(
        df.loc[:, "closedDate"].str[:-4].str.split("T").str.join(" "))
    df.loc[:, "timeToClose"] = (df.loc[:, "closeDateDT"] - df.loc[:, "createDateDT"]).dt.days

    # Calculate the Optimal number of bins based on Freedman-Diaconis Rule.

    # Replace empty rows with 0.0000001 To avoid log(0) error later.
    df.loc[:, "timeToClose"] = df.loc[:, "timeToClose"].fillna(0.0000001)

    # Replace negative values
    # TODO: figure out what to do when there is no data avaialble. 
    df = df[df["timeToClose"] > 0]
    if df.shape[0] == 0:
        raise PreventUpdate()
    else:
        q3, q1 = np.percentile(df.loc[:, "timeToClose"].astype(int), [75, 25])
        iqr = q3 - q1
        if not iqr:
            numBins = 100
        else:
            numBins = int((2 * iqr) / (df.shape[0]**(1 / 3)))

        # Log Transform, Compute IQR, then exclude outliers.
        df.loc[:, "logTimeToClose"] = np.log(df.loc[:, "timeToClose"])
        log_q3, log_q1 = np.percentile(df.loc[:, "logTimeToClose"], [75, 25])
        log_iqr = log_q3 - log_q1

    # Data Quality switch to remove outliers as defined by Median +- 1.5*IQR.
    if data_quality_switch:
        # TODO: figure out what happens when the filtering mechanism output no data at all.
        temp = df[(df.loc[:, "logTimeToClose"] > 1.5 * log_iqr - np.median(df.loc[:, "logTimeToClose"])) &
                   (df.loc[:, "logTimeToClose"] < 1.5 * log_iqr + np.median(df.loc[:, "logTimeToClose"]))]
        if temp.shape[0] > 0:
            df = temp
        data_quality_output = "Quality Filter: On"
    else:
        data_quality_output = "Quality Filter: Off"

    # Distribution for the total number of requests.
    print(" * Generating requests time to close histogram")
    time_close_histogram = px.histogram(df, x="timeToClose", title="Distribution of Time to Close Request", nbins=numBins, range_x=[min(
        df.loc[:, "timeToClose"]), max(df.loc[:, "timeToClose"])], labels={"timeToClose": "Request Duration", "count": "Frequency"})
    time_close_histogram.update_layout(margin=dict(l=50, r=50, b=50, t=50), font=dict(size=9))

    # Time Series for the Total Number of Requests.
    print(" * Generating number of requests line chart")
    req_time = pd.DataFrame(df.groupby("createDateDT", as_index=False)["srnumber"].count())
    num_req_line_chart = px.line(req_time, x="createDateDT", y="srnumber", title="Total Number of 311 Requests Overtime", labels={
                              "createDateDT": "DateTime", "srnumber": "Frequency"})
    num_req_line_chart.update_layout(margin=dict(l=25, r=25, b=25, t=50), font=dict(size=9))

    return time_close_histogram, num_req_line_chart, data_quality_output

@callback(
    Output("req_source_bar_chart", "figure"),
    Output("req_source_bar_chart2", "figure"),
    Output("total_req_card", "children"),
    Output("total_req_card2", "children"),
    Output("num_days_card", "children"),
    Output("num_days_card2", "children"),
    Output("overlay_req_time_line_chart", "figure"),
    Input("nc_comp_dropdown", "value"),
    Input("nc_comp_dropdown2", "value"),
    prevent_initial_call=True
)
def generate_nc_comparison_charts(nc_comp_dropdown, nc_comp_dropdown2):
    """Generates the comparison visualizations for LA 311 requests data based on the two selected neighborhood conucils.

    This function takes the first selected neighborhood council (nc) value from the "nc_comp_dropdown" dropdown and second selected neighborhood council value from "nc_comp_dropdown2"
    dropdown and output 3 sets of comparison visuals and 1 overlapping visual.

    Args:
        nc_comp_dropdown: A string argument automatically detected by Dash callback function when "nc_comp_dropdown" element is selected in the layout.
        nc_comp_dropdown2: A string argument automatically detected by Dash callback function when "nc_comp_dropdown2" element is selected in the layout.

    Returns: 
        req_source_bar_chart: bar chart showing the number of request from each source for the first neighborhood council (e.g. mobile, app, self-report...etc).
        req_source_bar_chart2: bar chart showing the number of request from each source for the second neighborhood council (e.g. mobile, app, self-report...etc).
        total_req_card: integer for the the total number of request in first selected neigborhood council.
        total_req_card2: integer for the total number of requests in the second selected neighborhood council.
        num_days_card: integer for the total number of days the data available in first selected neighborhood council span.
        num_days_card2: integer for the total number of days the data available in second selected neighborhood council span.
        overlay_req_time_line_chart: line chart showing the number of requests throughout the day for both first and second selected neighborhood council.
    """
    # Check if the neighborhood council dropdown is selected or not, else use all data.
    if not nc_comp_dropdown:
        df_nc1 = data_2020
    else:
        df_nc1 = data_2020[data_2020["councilName"] == nc_comp_dropdown]

    # Check if the second neighborhood council dropdown is selected or not, else use all data.
    if not nc_comp_dropdown2:
        df_nc2 = data_2020
    else:
        df_nc2 = data_2020[data_2020["councilName"] == nc_comp_dropdown2]

    # Convert the strings into datetime
    df_nc1.loc[:, "createDateDT"] = pd.to_datetime(
        df_nc1.loc[:, "createdDate"].str[:-4].str.split("T").str.join(" "))
    df_nc2.loc[:, "createDateDT"] = pd.to_datetime(
        df_nc2.loc[:, "createdDate"].str[:-4].str.split("T").str.join(" "))

    # Bar chart of different Request Type Sources for first selected neigbhorhood council.
    req_source = pd.DataFrame(df_nc1["sourceName"].value_counts())
    req_source = req_source.reset_index()
    req_source_bar_chart = px.bar(req_source, x="sourceName", y="index", orientation="h", title="Number of Requests by Source", labels={
                               "index": "Request Source", "sourceName": "Frequency"})
    req_source_bar_chart.update_layout(margin=dict(l=25, r=25, b=25, t=50), font=dict(size=9))

    # Bar chart of different Request Type Sources for second selected neigbhorhood council.
    req_source2 = pd.DataFrame(df_nc2["sourceName"].value_counts())
    req_source2 = req_source2.reset_index()
    req_source_bar_chart2 = px.bar(req_source2, x="sourceName", y="index", orientation="h", title="Number of Requests by Source", labels={
                                "index": "Request Source", "sourceName": "Frequency"})
    req_source_bar_chart2.update_layout(margin=dict(l=25, r=25, b=25, t=50), font=dict(size=9))

    # Total number of requests for first neigbhorhood council.
    total_req_card = df_nc1.shape[0]

    # Total number of requests for second neigbhorhood council.
    total_req_card2 = df_nc2.shape[0]

    # Total number of days the available requests in first neigbhorhood council span.
    num_days_card = np.max(df_nc1["createDateDT"].dt.day) - np.min(df_nc1["createDateDT"].dt.day) + 1

    # Total number of days the available requests in second neigbhorhood council span.
    num_days_card2 = np.max(df_nc2["createDateDT"].dt.day) - np.min(df_nc2["createDateDT"].dt.day) + 1

    # Overlapping line chart for number of request throughout the day for both first and second neighborhood council.
    req_time = pd.DataFrame(df_nc1.groupby("createDateDT", as_index=False)["srnumber"].count())
    req_time2 = pd.DataFrame(df_nc2.groupby("createDateDT", as_index=False)["srnumber"].count())
    overlay_req_time_line_chart = go.Figure()
    overlay_req_time_line_chart.add_trace(go.Scatter(
        x=req_time["createDateDT"], y=req_time["srnumber"], mode="lines", name="NC1"))
    overlay_req_time_line_chart.add_trace(go.Scatter(
        x=req_time2["createDateDT"], y=req_time2["srnumber"], mode="lines", name="NC2"))

    overlay_req_time_line_chart.update_layout(title="Number of Request Throughout the Day", margin=dict(l=25, r=25, b=35, t=50), xaxis_range=[min(
        min(req_time["createDateDT"]), min(req_time2["createDateDT"])), max(max(req_time["createDateDT"]), max(req_time2["createDateDT"]))], font=dict(size=9))

    return req_source_bar_chart, req_source_bar_chart2, total_req_card, total_req_card2, num_days_card, num_days_card2, overlay_req_time_line_chart

@callback(
    Output("nc_avg_comp_line_chart", "figure"),
    [Input("nc_dropdown", "value")]
)
def update_figure(nc_dropdown):
    """Generates a line chart visualizations for LA 311 requests data based on the two selected neighborhood conucils.

    This function takes the selected neighborhood council (nc) value from the "nc_dropdown" dropdown and output a line chart showing 
    the number of requests throughout the day and the average number of requests throughout the day (total number of requests / all 99 neighborhood councils).

    Args:
        nc_dropdown: A string argument automatically detected by Dash callback function when "nc_dropdown" element is selected in the layout.

    Returns: 
        nc_avg_comp_line_chart: line chart showing the number of requests throughout the day for the selected neighborhood council and average
    """
    # If dropdown value is empty, use all data available.
    if not nc_dropdown:
        df = data_2020
    
    # Calculating the average number of requests throughout the day.
    neighborhood_sum_df = df[df.council_name == nc_dropdown].groupby(["created_date"]).agg("sum").reset_index()  # noqa
    total_sum_df = df.groupby(["created_date"]).agg("sum").reset_index()
    total_sum_df["nc_avg"] = total_sum_df["counts"] / 99
    merged_df = neighborhood_sum_df.merge(total_sum_df["nc_avg"].to_frame(), left_index=True, right_index=True)  # noqa

    nc_avg_comp_line_chart = px.line(
        merged_df,
        x="created_date",
        y=["counts", "nc_avg"],
        color_discrete_sequence=DISCRETE_COLORS,
        labels=LABELS,
        title="Number of " + nc_dropdown + " Requests compare with the average of all Neighborhood Councils requests"
    )

    nc_avg_comp_line_chart.update_xaxes(
        tickformat="%a\n%m/%d",
    )

    nc_avg_comp_line_chart.update_traces(
        mode="markers+lines"
    )  # add markers to lines.

    return nc_avg_comp_line_chart
