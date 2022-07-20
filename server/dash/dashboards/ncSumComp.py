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

# Loading the dataframe with the 311 Data API
print(" * Downloading data for dataframe")
df_path = f"/requests/updated?start_date={start_date}&end_date={end_date}"
results = re.get(API_HOST + df_path)
data_json = results.json()
data_2020 = pd.json_normalize(data_json)
print(" * Loading complete dataframe")

layout = html.Div([

    html.Div(children=[

        # Neighborhood Council Dashboard
        html.Div(children=[
            html.H2("LA 311 Requests - Neighborhood Council Summary Dashboard",
                    style={'vertical-align': 'middle'}),
            html.Div([daq.ToggleSwitch(id='dataQualitySwitch', value=True, style={'height': 'vh'}, size=35),
            html.Div(id='dataQualityOutput')], style={'font-family': 'Open Sans'})
        ], style={'display': 'flex', "justify-content": "space-between", 'vertical-align': 'middle', 'height': '5vh', 'width': '97.5vw'}),

        # Summary Dropdown
        html.Div(children=[
            html.Div(dcc.Dropdown(sorted([n for n in set(data_2020['councilName'])]), ' ', id='nc_dropdown',
                     placeholder="Select a Neighborhood Council..."), style={'display': 'inline-block', 'width': '48.5vw'}),
            html.Div(dcc.Dropdown(id='nc_dropdown_filter', multi=True, placeholder="Select a Request Type..."), style={
                     'display': 'inline-block', 'width': '48.5vw'})
        ], style={'display': 'flex', "justify-content": "space-between", "width": "97.5vw", "height": "10vh"}),

        html.Div(html.Br(), style={"height": "0.5vh"}),

        # Line Chart for Number of Request throughout the day
        html.Div(dcc.Graph(id='ncAvgCompLineChart', style={"height": "40vh", 'width': '97.4vw'}), style={
                 "border": "0.5px black solid", "height": "40vh", 'width': '97.4vw'}),

        html.Div(html.Br(), style={"height": "1vh"}),

        html.Div(children=[
            html.Div(
                # Pie Chart for the share of request type
                dcc.Graph(
                    id="reqTypePieChart", style={"height": "40vh", 'width': '48.5vw'}
                ), style={'display': 'inline-block', 'width': '48.5vw', "border": "0.5px black solid", "height": "40vh"}),  # for border-radius , add stuff later
            html.Div(
                # Histogram for the request timeToClose
                dcc.Graph(
                    id="timeCloseHist", style={"height": "40vh", 'width': '48vw'}
                ), style={'display': 'inline-block', 'width': '48vw', "border": "0.5px black solid", "height": "40vh"})
        ], style={'display': 'flex', "justify-content": "space-between", "width": '97.5vw'})

    ]),

    html.Div(html.Br(), style={"height": "vh"}),

    # Neighborhood Council Summarization Dashboard
    html.Div(children=[
        html.H2("LA 311 Requests - Neighborhood Council Comparison Dashboard")
    ], style={'textAlign': 'center', 'height': '5vh'}),

    # Comparison Dropdowns
    html.Div(children=[
        html.Div(dcc.Dropdown(sorted([n for n in set(data_2020['councilName'])]), ' ', id='nc_comp_dropdown',
                 placeholder="Select a Neighborhood Council..."), style={'display': 'inline-block', 'width': '48.5vw'}),
        html.Div(dcc.Dropdown(sorted([n for n in set(data_2020['councilName'])]), ' ', id='nc_comp_dropdown2',
                 placeholder="Select a Neighborhood Council..."), style={'display': 'inline-block', 'width': '48.5vw'}),
    ], style={'display': 'flex', "justify-content": "space-between", "width": "97.5vw", "height": "12vh"}),

    html.Div(html.Br(), style={"height": "1vh"}),

    # NC Comparison - Indicator Visuals
    html.Div(children=[
        html.Div(children=[

            # Indicator Visuals for Total number of requests and the number of days the data spans across
            html.Div([
                html.H6("Total Number of Requests", style={"text-align": 'center'}),
                html.H1(id='totalReqCard', style={"text-align": 'center'})],
                style={'display': 'inline-block', 'width': '24vw', 'height': '16vh', "border": "0.5px black solid"}),
            html.Div([
                html.H6("Number of Days", style={"text-align": 'center'}),
                html.H1(id='numDaysCard', style={"text-align": 'center'})],
                style={'display': 'inline-block', 'width': '24vw', 'height': '16vh', "border": "0.5px black solid"})

        ], style={'display': 'flex', "justify-content": "space-between", 'width': '48.5vw'}),

        # Indicator Visuals for Total number of requests and the number of days the data spans across
        html.Div(children=[
            html.Div([
                html.H6("Total Number of Requests", style={"text-align": 'center'}),
                html.H1(id='totalReqCard2', style={"text-align": 'center'})],
                style={'display': 'inline-block', 'width': '24vw', 'height': '16vh', "border": "0.5px black solid"}),
            html.Div([
                html.H6("Number of Days", style={"text-align": 'center'}),
                html.H1(id='numDaysCard2', style={"text-align": 'center'})],
                style={'display': 'inline-block', 'width': '24vw', 'height': '16vh', "border": "0.5px black solid"})

        ], style={'display': 'flex', "justify-content": "space-between", 'width': '48.5vw'})
    ], style={'display': 'flex', "justify-content": "space-between", "width": "97.5vw"}),

    html.Div(html.Br(), style={"height": "1vh"}),

    # NC Comparison -  Request Source Bar Charts
    html.Div(children=[
        html.Div(dcc.Graph(id='reqSourceBarChart', style={"height": "30vh"}), style={
                 'display': 'inline-block', 'width': '48.5vw', "border": "0.5px black solid", "height": "30vh"}),
        html.Div(dcc.Graph(id='reqSourceBarChart2', style={"height": "30vh"}), style={
                 'display': 'inline-block', 'width': '48.5vw', "border": "0.5px black solid", "margin-left": "10px", "height": "30vh"})
    ], style={'display': 'flex', "justify-content": "space-between", "width": "97.5vw"}),

    html.Div(html.Br(), style={"height": "1vh"}),

    # NC Comparison - Number of Requests per day Overlapping line chart
    html.Div(dcc.Graph(id='overlayReqTimeLineChart', style={"height": "32vh", "width": "97.5vw"}), style={
             "border": "0.5px black solid", "height": "32vh", "width": "97.5vw"})
])

@callback(
    [Output('nc_dropdown_filter', 'options'),
     Output('nc_dropdown_filter', 'value')],
    Input('nc_dropdown', 'value')
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
        df = data_2020[data_2020['councilName'] == nc_dropdown]

    rTypes = sorted([n for n in set(df['typeName'])])
    return rTypes, ' '

@callback(
    Output('reqTypePieChart', 'figure'),
    Output('timeCloseHist', 'figure'),
    Output('numReqLineChart', 'figure'),
    Output('dataQualityOutput', 'children'),
    Input('nc_dropdown', 'value'),
    [Input('nc_dropdown_filter', 'value')],
    Input('dataQualitySwitch', 'value')
)
def generate_nc_summary_charts(nc_dropdown, nc_dropdown_filter=None, dataQualitySwitch=True):
    """Generates the summary visualizations for LA 311 requests data based on selected neighborhood conucil, request types, and data quality switch.

    This function takes the selected neighborhood council (nc) value from the "nc_dropdown" dropdown, selected request type from "nc_dropdown_filter"
    dropdown, and the status on the "dataQualitySwitch" toggle to output a 4 main visualizations to provide an overview.

    Args:
        nc_dropdown: A string argument automatically detected by Dash callback function when "nc_dropdown" element is selected in the layout.
        nc_dropdown_filter: A list of strings automatically detected by Dash callback function when "nc_dropdown_filter" element is selected in the layout, default None.
        dataQualitySwitch: A boolean for data quality filter automatically detected by Dash callback function when "dataQualitySwitch" element is selected in the layout, default True.

    Returns: 
        reqTypePieChart: pie chart that shows the share of request types out of all requests.
        timeCloseHist: histogram showing the distribution of time it takes for requests to close.
        numReqLineChart: line chart showing the number of requests throughout the day.
        dataQualityOutput: A string stating the status of the data quality filter ("Quality Filter: On" or "Quality Filter: Off").
    """
    print(" * Generating summary visualizations")
    # NC Dropdown
    if not nc_dropdown:
        df = data_2020
    else:
        df = data_2020[data_2020['councilName'] == nc_dropdown]
    # Filter as per selection on Reqquest Type Dropdown
    if not nc_dropdown_filter and not nc_dropdown:
        df = data_2020
    elif nc_dropdown_filter:
        df = df[df['typeName'].isin(nc_dropdown_filter)]

    # Pie Chart for the distribution of Request Types
    print(" * Generating requests types pie chart")
    rtype = pd.DataFrame(df['typeName'].value_counts())
    rtype = rtype.reset_index()
    reqTypePieChart = px.pie(rtype, values="typeName", names="index",
                             title="Share of each Request Type")
    reqTypePieChart.update_layout(margin=dict(l=50, r=50, b=50, t=50),
                                  legend_title=dict(font=dict(size=10)), font=dict(size=9))

    # Distribution of Time to Close Date of each request
    # Calculate the Time to Closed
    df.loc[:, 'createDateDT'] = pd.to_datetime(
        df.loc[:, 'createdDate'].str[:-4].str.split("T").str.join(" "))
    df.loc[:, 'closeDateDT'] = pd.to_datetime(
        df.loc[:, 'closedDate'].str[:-4].str.split("T").str.join(" "))
    df.loc[:, 'timeToClose'] = (df.loc[:, 'closeDateDT'] - df.loc[:, 'createDateDT']).dt.days

    # Calculate the Optimal number of bins based on Freedman-Diaconis Rule

    # Replace empty rows with 0.0000001 To avoid log(0) error later
    df.loc[:, "timeToClose"] = df.loc[:, "timeToClose"].fillna(0.0000001)

    # Replace negative values
    # TODO: figure out what to do when there is no data avaialble
    df = df[df['timeToClose'] > 0]
    if df.shape[0] == 0:
        raise PreventUpdate()
    else:
        q3, q1 = np.percentile(df.loc[:, "timeToClose"].astype(int), [75, 25])
        iqr = q3 - q1
        if not iqr:
            numBins = 100
        else:
            numBins = int((2 * iqr) / (df.shape[0]**(1 / 3)))

        # Log Transform, Compute IQR, then exclude outliers
        df.loc[:, "logTimeToClose"] = np.log(df.loc[:, "timeToClose"])
        log_q3, log_q1 = np.percentile(df.loc[:, "logTimeToClose"], [75, 25])
        log_iqr = log_q3 - log_q1

    # Data Quality switch to remove outliers as defined by Median +- 1.5*IQR
    if dataQualitySwitch:
        # TODO: figure out what happens when the filtering mechanism output no data at all
        temp = df[(df.loc[:, "logTimeToClose"] > 1.5 * log_iqr - np.median(df.loc[:, "logTimeToClose"])) &
                   (df.loc[:, "logTimeToClose"] < 1.5 * log_iqr + np.median(df.loc[:, "logTimeToClose"]))]
        if temp.shape[0] > 0:
            df = temp
        dataQualityOutput = "Quality Filter: On"
    else:
        dataQualityOutput = "Quality Filter: Off"

    # Distribution for the total number of requests
    print(" * Generating requests time to close histogram")
    timeCloseHist = px.histogram(df, x="timeToClose", title="Distribution of Time to Close Request", nbins=numBins, range_x=[min(
        df.loc[:, 'timeToClose']), max(df.loc[:, 'timeToClose'])], labels={"timeToClose": "Request Duration", "count": "Frequency"})
    timeCloseHist.update_layout(margin=dict(l=50, r=50, b=50, t=50), font=dict(size=9))

    # Time Series for the Total Number of Requests
    print(" * Generating number of requests line chart")
    rtime = pd.DataFrame(df.groupby('createDateDT', as_index=False)['srnumber'].count())
    numReqLineChart = px.line(rtime, x="createDateDT", y='srnumber', title="Total Number of 311 Requests Overtime", labels={
                              "createDateDT": "DateTime", "srnumber": "Frequency"})
    numReqLineChart.update_layout(margin=dict(l=25, r=25, b=25, t=50), font=dict(size=9))

    return reqTypePieChart, timeCloseHist, numReqLineChart, dataQualityOutput

@callback(
    Output('reqSourceBarChart', 'figure'),
    Output('reqSourceBarChart2', 'figure'),
    Output('totalReqCard', 'children'),
    Output('totalReqCard2', 'children'),
    Output('numDaysCard', 'children'),
    Output('numDaysCard2', 'children'),
    Output('overlayReqTimeLineChart', 'figure'),
    Input('nc_comp_dropdown', 'value'),
    Input('nc_comp_dropdown2', 'value'),
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
        reqSourceBarChart: bar chart showing the number of request from each source for the first neighborhood council (e.g. mobile, app, self-report...etc).
        reqSourceBarChart2: bar chart showing the number of request from each source for the second neighborhood council (e.g. mobile, app, self-report...etc).
        totalReqCard: integer for the the total number of request in first selected neigborhood council.
        totalReqCard2: integer for the total number of requests in the second selected neighborhood council.
        numDaysCard: integer for the total number of days the data available in first selected neighborhood council span.
        numDaysCard2: integer for the total number of days the data available in second selected neighborhood council span.
        overlayReqTimeLineChart: line chart showing the number of requests throughout the day for both first and second selected neighborhood council.
    """
    # Check if the neighborhood council dropdown is selected or not, else use all data
    if not nc_comp_dropdown:
        df_nc1 = data_2020
    else:
        df_nc1 = data_2020[data_2020['councilName'] == nc_comp_dropdown]

    # Check if the second neighborhood council dropdown is selected or not, else use all data
    if not nc_comp_dropdown2:
        df_nc2 = data_2020
    else:
        df_nc2 = data_2020[data_2020['councilName'] == nc_comp_dropdown2]

    # Convert the strings into datetime
    df_nc1.loc[:, 'createDateDT'] = pd.to_datetime(
        df_nc1.loc[:, 'createdDate'].str[:-4].str.split("T").str.join(" "))
    df_nc2.loc[:, 'createDateDT'] = pd.to_datetime(
        df_nc2.loc[:, 'createdDate'].str[:-4].str.split("T").str.join(" "))

    # Bar chart of different Request Type Sources for first selected neigbhorhood council
    rSource = pd.DataFrame(df_nc1['sourceName'].value_counts())
    rSource = rSource.reset_index()
    reqSourceBarChart = px.bar(rSource, x="sourceName", y="index", orientation='h', title='Number of Requests by Source', labels={
                               "index": "Request Source", "sourceName": "Frequency"})
    reqSourceBarChart.update_layout(margin=dict(l=25, r=25, b=25, t=50), font=dict(size=9))

    # Bar chart of different Request Type Sources for second selected neigbhorhood council
    rSource2 = pd.DataFrame(df_nc2['sourceName'].value_counts())
    rSource2 = rSource2.reset_index()
    reqSourceBarChart2 = px.bar(rSource2, x="sourceName", y="index", orientation='h', title='Number of Requests by Source', labels={
                                "index": "Request Source", "sourceName": "Frequency"})
    reqSourceBarChart2.update_layout(margin=dict(l=25, r=25, b=25, t=50), font=dict(size=9))

    # Total number of requests for first neigbhorhood council
    totalReqCard = df_nc1.shape[0]

    # Total number of requests for second neigbhorhood council
    totalReqCard2 = df_nc2.shape[0]

    # Total number of days the available requests in first neigbhorhood council span
    numDaysCard = np.max(df_nc1['createDateDT'].dt.day) - np.min(df_nc1['createDateDT'].dt.day) + 1

    # Total number of days the available requests in second neigbhorhood council span
    numDaysCard2 = np.max(df_nc2['createDateDT'].dt.day) - np.min(df_nc2['createDateDT'].dt.day) + 1

    # Overlapping line chart for number of request throughout the day for both first and second neighborhood council
    rTime = pd.DataFrame(df_nc1.groupby('createDateDT', as_index=False)['srnumber'].count())
    rTime2 = pd.DataFrame(df_nc2.groupby('createDateDT', as_index=False)['srnumber'].count())
    overlayReqTimeLineChart = go.Figure()
    overlayReqTimeLineChart.add_trace(go.Scatter(
        x=rTime['createDateDT'], y=rTime['srnumber'], mode='lines', name='NC1'))
    overlayReqTimeLineChart.add_trace(go.Scatter(
        x=rTime2['createDateDT'], y=rTime2['srnumber'], mode='lines', name='NC2'))

    overlayReqTimeLineChart.update_layout(title='Number of Request Throughout the Day', margin=dict(l=25, r=25, b=35, t=50), xaxis_range=[min(
        min(rTime['createDateDT']), min(rTime2['createDateDT'])), max(max(rTime['createDateDT']), max(rTime2['createDateDT']))], font=dict(size=9))

    return reqSourceBarChart, reqSourceBarChart2, totalReqCard, totalReqCard2, numDaysCard, numDaysCard2, overlayReqTimeLineChart

@callback(
    Output('ncAvgCompLineChart', 'figure'),
    [Input("nc_dropdown", "value")]
)
def update_figure(nc_dropdown):
    """Generates a line chart visualizations for LA 311 requests data based on the two selected neighborhood conucils.

    This function takes the selected neighborhood council (nc) value from the "nc_dropdown" dropdown and output a line chart showing 
    the number of requests throughout the day and the average number of requests throughout the day (total number of requests / all 99 neighborhood councils).

    Args:
        nc_dropdown: A string argument automatically detected by Dash callback function when "nc_dropdown" element is selected in the layout.

    Returns: 
        ncAvgCompLineChart: line chart showing the number of requests throughout the day for the selected neighborhood council and average
    """
    # If dropdown value is empty, use all data available
    if not nc_dropdown:
        df = data_2020
    
    # Calculating the average number of requests throughout the day
    neighborhood_sum_df = df[df.council_name == nc_dropdown].groupby(['created_date']).agg('sum').reset_index()  # noqa
    total_sum_df = df.groupby(['created_date']).agg('sum').reset_index()
    total_sum_df["nc_avg"] = total_sum_df["counts"] / 99
    merged_df = neighborhood_sum_df.merge(total_sum_df["nc_avg"].to_frame(), left_index=True, right_index=True)  # noqa

    fig = px.line(
        merged_df,
        x="created_date",
        y=['counts', 'nc_avg'],
        color_discrete_sequence=DISCRETE_COLORS,
        labels=LABELS,
        title="Number of " + nc_dropdown + " Requests compare with the average of all Neighborhood Councils requests"
    )

    fig.update_xaxes(
        tickformat="%a\n%m/%d",
    )

    fig.update_traces(
        mode='markers+lines'
    )  # add markers to lines

    apply_figure_style(fig)

    return fig
