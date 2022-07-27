import textwrap
import datetime
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from dash import dcc, html

from config import API_HOST
from design import LABELS

TITLE = "OVERVIEW COMBINED DASHBOARD"

# DATA
NC_REQ_TYPE_DATA_API_PATH = '/reports?field=type_name&field=council_name&field=created_date'
print(" * Downloading data from API path: " + NC_REQ_TYPE_DATA_API_PATH)
df = pd.read_json(API_HOST + NC_REQ_TYPE_DATA_API_PATH)
print(" * Dataframe has been loaded from API path: " + NC_REQ_TYPE_DATA_API_PATH)

# Loading the dataframe for the NCs and correspoding requests
NC_REQ_COUNT_DATA_API_PATH = "/reports?field=council_name&filter=created_date>=2016-01-01"
print(" * Downloading data from API path: " + NC_REQ_COUNT_DATA_API_PATH)
df1 = pd.read_json(API_HOST + NC_REQ_COUNT_DATA_API_PATH)
df1 = df1.groupby(['council_name'])['counts'].sum().sort_values().to_frame()
print(" * Dataframe has been loaded from API path: " + NC_REQ_COUNT_DATA_API_PATH)

# Loading the data for the number of new requests
NEW_REQ_COUNT_DATA_API_PATH = "/reports?field=created_year&filter=created_date>=2016-01-01"
print(" * Downloading data from API path: " + NEW_REQ_COUNT_DATA_API_PATH)
df2 = pd.read_json(API_HOST + NEW_REQ_COUNT_DATA_API_PATH)
df2 = df2.groupby(['created_year'])['counts'].sum().to_frame()
print(" * Dataframe has been loaded from API path: " + NEW_REQ_COUNT_DATA_API_PATH)

# Loading the count of each request types overall
REQ_COUNT_DATA_API_PATH = "/reports?field=type_name&filter=created_date>=2016-01-01"
print(" * Downloading data from API path: " + REQ_COUNT_DATA_API_PATH)
df3 = pd.read_json(API_HOST + REQ_COUNT_DATA_API_PATH)
df3 = df3.groupby(['type_name'], as_index=False)['counts'].sum()
print(" * Dataframe has been loaded from API path: " + REQ_COUNT_DATA_API_PATH)

# Loading the total number of request source
REQ_SOURCE_COUNT_DATA_API_PATH = "/reports?field=source_name&filter=created_date>=2016-01-01"
print(" * Downloading data from API path: " + REQ_SOURCE_COUNT_DATA_API_PATH)
df6 = pd.read_json(API_HOST + REQ_SOURCE_COUNT_DATA_API_PATH)
reqSourceLab = df6.groupby(['source_name'])['counts'].sum()
print(" * Dataframe has been loaded from API path: " + REQ_SOURCE_COUNT_DATA_API_PATH)

# Loading the number of Request Agencies
REQ_AGENCY_COUNT_DATA_API_PATH = "/reports?field=agency_name&filter=created_date>=2016-01-01"
print(" * Downloading data from API path: " + REQ_AGENCY_COUNT_DATA_API_PATH)
df5 = pd.read_json(API_HOST + REQ_AGENCY_COUNT_DATA_API_PATH)
reqAgency = df5.groupby(['agency_name'])['counts'].sum()
print(" * Dataframe has been loaded from API path: " + REQ_AGENCY_COUNT_DATA_API_PATH)

# Request Share by Agency Pie Chart
print(" * Downloading data for dataframe")
query_string = "/reports?field=agency_name&filter=created_date>=2016-01-01"
df5 = pd.read_json(API_HOST + query_string)
df5 = df5.groupby(['agency_name'])['counts'].sum().to_frame()
df5.sort_values('counts', ascending=False, inplace=True)
df5.loc['Others'] = df5[4:].sum()
df5.sort_values('counts', ascending=False, inplace=True)
df5 = df5[:5]
df5.index = df5.index.map(lambda x: '<br>'.join(textwrap.wrap(x, width=16)))

shareReqByAgencyPieChart = px.pie(
    df5,
    names=df5.index,
    values='counts',
    labels=LABELS,
    hole=.3,
    TITLE="Total Requests by Agency",
)
shareReqByAgencyPieChart.update_layout(margin=dict(l=100, r=100, b=100, t=100))

# Request Type by Source Bar Chart
print(" * Downloading data for dataframe")
query_string = "/reports?field=source_name&filter=created_date>=2016-01-01"
df6 = pd.read_json(API_HOST + query_string)
df6 = df6.groupby(['source_name'])['counts'].sum().to_frame()
df6.sort_values('counts', ascending=False, inplace=True)
df6.loc['Others'] = df6[4:].sum()
df6.sort_values('counts', ascending=False, inplace=True)
df6 = df6[:5]
reqSourceBarchart = px.bar(
    df6,
    y=df6.index,
    x='counts',
    TITLE="Total Requests by Source",
    orientation='h'
)

# Median Request Days to Close Box Plot
stas_df = pd.read_json(API_HOST + '/types/stats')
stas_df = stas_df.sort_values('median', ascending=False)
medDaysToCloseBoxPlot = go.Figure()
medDaysToCloseBoxPlot.add_trace(
    go.Box(
        y=stas_df.type_name,
        q1=stas_df['q1'],
        median=stas_df['median'],
        q3=stas_df['q3'],
        marker_color='#29404F',
        fillcolor='#E17C05',
    )
)
medDaysToCloseBoxPlot.update_xaxes(

    dtick=5
)
medDaysToCloseBoxPlot.update_layout(
    TITLE="Total Median Days to Close by Type",
)

# Day of Week Bar Chart:
start_date = datetime.date.today() - datetime.timedelta(days=30)
end_date = datetime.date.today() - datetime.timedelta(days=1)
query_string = f"/reports?filter=created_date>={start_date}&filter=created_date<={end_date}"  # noqa
print(" * Downloading data for dataframe")
df = pd.read_json(API_HOST + query_string)
df['created_date'] = pd.to_datetime(df['created_date'])
dow_df = df.groupby(['created_date']).agg('sum').reset_index()
dow_df['day_of_week'] = dow_df['created_date'].dt.day_name()
numReqByDayOfWeekBarChart = px.bar(
    dow_df,
    x="day_of_week",
    y="counts",
    labels=LABELS,
)
numReqByDayOfWeekBarChart.update_xaxes(categoryorder='array', categoryarray= ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"])

# Total Request by NC
print(" * Downloading data for dataframe")
query_string = "/reports?field=council_name&filter=created_date>=2016-01-01"
df1 = pd.read_json(API_HOST + query_string)
df1 = df1.groupby(['council_name'])['counts'].sum().sort_values().to_frame()
reqByNcBarChart = px.bar(
    df1,
    x=df1.index,
    y='counts',
    labels=LABELS,
    TITLE="Total Requests by Neighborhood Councils",
)
reqByNcBarChart.update_layout(font=dict(size=12))

# LAYOUT
layout = html.Div([
    # Page 2 with Cards + Stuf
    html.H1(TITLE + " Pt. 1"),
    html.P("The figures below represent the total number of 311 requests made across LA County from 2016-2021. In 2020, we saw an all-time high with more than 1.4 million requests.",
           style={'font-size': '18px', 'font-style': 'italic'}),

    html.Div([
        html.Div([html.H2(f"{df2['counts'].sum():,}"), html.Label(
            "Total Requests")], style={"text-align": 'center', "border": "0.5px black solid", 'width': '18vw', 'display': 'inline-block'}),
        html.Div([html.H2(df1.shape[0] - 1), html.Label("Neighborhoods")],
                    style={"text-align": 'center', "border": "0.5px black solid", 'width': '18vw', 'display': 'inline-block'}),
        html.Div([html.H2(df3.shape[0]), html.Label("Request Types")], style={
                 "text-align": 'center', "border": "0.5px black solid", 'width': '18vw', 'display': 'inline-block'}),
        html.Div([html.H2(reqSourceLab.shape[0]), html.Label("Request Source")], style={
                 "text-align": 'center', "border": "0.5px black solid", 'width': '18vw', 'display': 'inline-block'}),
        html.Div([html.H2(reqAgency.shape[0]), html.Label("Request Agency")], style={
                 "text-align": 'center', "border": "0.5px black solid", 'width': '18vw', 'display': 'inline-block'})
        ], style={'display': 'flex', "justify-content": "space-between"}),

    html.Div(html.Br(), style={"height": "3vh"}),
    html.Div([
        html.Div(dcc.Graph(id='medDaysToCloseBoxPlot', figure=medDaysToCloseBoxPlot, responsive=True, style={
                 "width": "60vw", "height": "60vh"}), style={"border": "0.5px black solid"}),
        html.Div(dcc.Graph(id='shareReqByAgencyPieChart', figure=shareReqByAgencyPieChart, className="half-graph",
                 responsive=True, style={"width": "35vw", "height": "60vh"}), style={"border": "0.5px black solid"})
    ], className="graph-row", style={'display': 'flex', "justify-content": "space-between"}),
    html.Div(html.Br(), style={"height": "2vh"}),
    html.H1(TITLE + " Pt. 2"),
    html.Div([
        html.Div(dcc.Graph(id='numReqByDayOfWeekBarChart', figure=numReqByDayOfWeekBarChart, className="half-graph", style={"width": "48vw", "height": "40vh"}), style={"border": "0.5px black solid"}),   # noqa
        html.Div(dcc.Graph(id='reqSourceBarchart', figure=reqSourceBarchart, className="half-graph",
                 responsive=True, style={"width": "48vw", "height": "40vh"}), style={"border": "0.5px black solid"})
    ], className="graph-row", style={'display': 'flex', "justify-content": "space-between"}),
    html.Div(html.Br(), style={"height": "2vh"}),
    html.Div(dcc.Graph(id='reqByNcBarChart', figure=reqByNcBarChart, responsive=True,
             style={"height": "45vh"}), style={"border": "0.5px black solid"})

])
