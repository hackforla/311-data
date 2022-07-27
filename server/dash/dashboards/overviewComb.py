import textwrap
import datetime
import urllib.parse
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from dash import dcc, html

from config import API_HOST
from design import LABELS

TITLE = "OVERVIEW COMBINED DASHBOARD"
REPORT_API_PATH_ROOT = "/reports?"
# DATA

# Loading the dataframe for the NCs and correspoding requests
nc_req_count_api_params = {'field':'council_name', 'filter':'created_date>=2016-01-01'}
NC_REQ_COUNT_DATA_API_PATH = REPORT_API_PATH_ROOT + urllib.parse.urlencode(nc_req_count_api_params)
print(" * Downloading data from API path: " + NC_REQ_COUNT_DATA_API_PATH)
nc_req_count_df = pd.read_json(API_HOST + NC_REQ_COUNT_DATA_API_PATH)
nc_req_count_df = nc_req_count_df.groupby(['council_name'])['counts'].sum().sort_values().to_frame()
print(" * Dataframe has been loaded from API path: " + NC_REQ_COUNT_DATA_API_PATH)

# Loading the data for the number of new requests
new_req_count_api_params = {'field':'created_year', 'filter':'created_date>=2016-01-01'}
NEW_REQ_COUNT_DATA_API_PATH = REPORT_API_PATH_ROOT + urllib.parse.urlencode(new_req_count_api_params)
print(" * Downloading data from API path: " + NEW_REQ_COUNT_DATA_API_PATH)
new_req_count_df = pd.read_json(API_HOST + NEW_REQ_COUNT_DATA_API_PATH)
new_req_count_df = new_req_count_df.groupby(['created_year'])['counts'].sum().to_frame()
print(" * Dataframe has been loaded from API path: " + NEW_REQ_COUNT_DATA_API_PATH)

# Loading the count of each request types overall
req_count_api_params = {'field':'type_name', 'filter':'created_date>=2016-01-01'}
REQ_COUNT_DATA_API_PATH = REPORT_API_PATH_ROOT + urllib.parse.urlencode(req_count_api_params)
print(" * Downloading data from API path: " + REQ_COUNT_DATA_API_PATH)
req_count_df = pd.read_json(API_HOST + REQ_COUNT_DATA_API_PATH)
req_count = req_count_df.groupby(['type_name'], as_index=False)['counts'].sum()
print(" * Dataframe has been loaded from API path: " + REQ_COUNT_DATA_API_PATH)

# Loading the total number of request source
req_source_count_api_params = {'field':'source_name', 'filter':'created_date>=2016-01-01'}
REQ_SOURCE_COUNT_DATA_API_PATH = REPORT_API_PATH_ROOT + urllib.parse.urlencode(req_source_count_api_params)
print(" * Downloading data from API path: " + REQ_SOURCE_COUNT_DATA_API_PATH)
req_source_count_df = pd.read_json(API_HOST + REQ_SOURCE_COUNT_DATA_API_PATH)
req_source_count = req_source_count_df.groupby(['source_name'])['counts'].sum()
print(" * Dataframe has been loaded from API path: " + REQ_SOURCE_COUNT_DATA_API_PATH)

# Loading the number of Request Agencies
req_agency_count_api_params = {'field':'agency_name', 'filter':'created_date>=2016-01-01'}
REQ_AGENCY_COUNT_DATA_API_PATH = REPORT_API_PATH_ROOT + urllib.parse.urlencode(req_agency_count_api_params)
print(" * Downloading data from API path: " + REQ_AGENCY_COUNT_DATA_API_PATH)
req_agency_count_df = pd.read_json(API_HOST + REQ_AGENCY_COUNT_DATA_API_PATH)
agency_count = req_agency_count_df.groupby(['agency_name'])['counts'].sum()
print(" * Dataframe has been loaded from API path: " + REQ_AGENCY_COUNT_DATA_API_PATH)

# Request Share by Agency Pie Chart
req_agency_count_df = agency_count.to_frame()
req_agency_count_df.sort_values('counts', ascending=False, inplace=True)
req_agency_count_df.loc['Others'] = req_agency_count_df[4:].sum()
req_agency_count_df.sort_values('counts', ascending=False, inplace=True)
req_agency_count_df = req_agency_count_df[:5]
req_agency_count_df.index = req_agency_count_df.index.map(
    lambda x: '<br>'.join(textwrap.wrap(x, width=16)))

req_share_by_agency_pie_chart = px.pie(
    req_agency_count_df,
    names=req_agency_count_df.index,
    values='counts',
    labels=LABELS,
    hole=.3,
    title="Total Requests by Agency",
)
req_share_by_agency_pie_chart.update_layout(margin=dict(l=100, r=100, b=100, t=100))

# Request Type by Source Bar Chart
req_source_count_df = req_source_count.to_frame()
req_source_count_df.sort_values('counts', ascending=False, inplace=True)
req_source_count_df.loc['Others'] = req_source_count_df[4:].sum()
req_source_count_df.sort_values('counts', ascending=False, inplace=True)
req_source_count_df = req_source_count_df[:5]

req_source_bar_chart = px.bar(
    req_source_count_df,
    y=req_source_count_df.index,
    x='counts',
    title="Total Requests by Source",
    orientation='h'
)

# Median Request Days to Close Box Plot
REQ_TYPE_STATS_API_PATH  = '/types/stats'
print(" * Downloading data from API path: " + REQ_TYPE_STATS_API_PATH)
stats_df = pd.read_json(API_HOST + REQ_TYPE_STATS_API_PATH)
stats_df = stats_df.sort_values('median', ascending=False)
print(" * Dataframe has been loaded from API path: " + REQ_TYPE_STATS_API_PATH)

med_days_to_close_box_plot = go.Figure()
med_days_to_close_box_plot.add_trace(
    go.Box(
        y=stats_df.type_name,
        q1=stats_df['q1'],
        median=stats_df['median'],
        q3=stats_df['q3'],
        marker_color='#29404F',
        fillcolor='#E17C05',
    )
)
med_days_to_close_box_plot.update_xaxes(
    dtick=5
)
med_days_to_close_box_plot.update_layout(
    title="Total Median Days to Close by Type",
)

# Day of Week Bar Chart:
start_date = datetime.date.today() - datetime.timedelta(days=365)
end_date = datetime.date.today() - datetime.timedelta(days=1)
date_range_req_data_params = {'filter':f"created_date>={start_date}", 'filter':f"created_date<={end_date}"}
DATE_RANGE_REQ_DATA_API_PATH = REPORT_API_PATH_ROOT + urllib.parse.urlencode(date_range_req_data_params)
print(" * Downloading data for dataframe from API path: " + DATE_RANGE_REQ_DATA_API_PATH)
date_range_req_df = pd.read_json(API_HOST + DATE_RANGE_REQ_DATA_API_PATH)
print(" * Dataframe has been loaded from API path: " + DATE_RANGE_REQ_DATA_API_PATH)
date_range_req_df['created_date'] = pd.to_datetime(date_range_req_df['created_date'])
day_of_week_df = date_range_req_df.groupby(['created_date']).agg('sum').reset_index()
day_of_week_df['day_of_week'] = day_of_week_df['created_date'].dt.day_name()

num_req_by_day_bar_chart = px.bar(
    day_of_week_df,
    x="day_of_week",
    y="counts",
    labels=LABELS,
)
num_req_by_day_bar_chart.update_xaxes(categoryorder='array', categoryarray=[
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"])

# Total Request by NC
req_by_nc_bar_chart = px.bar(
    nc_req_count_df,
    x=nc_req_count_df.index,
    y='counts',
    labels=LABELS,
    title="Total Requests by Neighborhood Councils",
)
req_by_nc_bar_chart.update_layout(font=dict(size=12))

# LAYOUT VARIABLES
INDICATOR_CARD_STYLE = {"text-align": 'center',
    "border": "0.5px black solid", 'width': '18vw', 'display': 'inline-block'}
BORDER_STYLE = {"border": "0.5px black solid"}
EQUAL_SPACE_BOX_STYLE = {'display': 'flex', "justify-content": "space-between"}
TWO_CHART_STYLE = {"width": "48vw", "height": "40vh"}
DASHBOARD_OUTLINE = "The figures below represent the total number of 311 requests made across LA County from 2016-2021. In 2020, we saw an all-time high with more than 1.4 million requests."

# LAYOUT
layout = html.Div([

    # Part 1 of dashboard
    html.H1(TITLE + " Pt. 1"),
    html.P(DASHBOARD_OUTLINE, style={'font-size': '18px', 'font-style': 'italic'}),

    html.Div([
        html.Div([html.H2(f"{new_req_count_df['counts'].sum():,}"), html.Label(
            "Total Requests")], style=INDICATOR_CARD_STYLE),
        html.Div([html.H2(nc_req_count_df.shape[0] - 1), html.Label("Neighborhoods")],
                    style=INDICATOR_CARD_STYLE),
        html.Div([html.H2(req_count_df.shape[0]), html.Label(
            "Request Types")], style=INDICATOR_CARD_STYLE),
        html.Div([html.H2(req_source_count.shape[0]), html.Label(
            "Request Source")], style=INDICATOR_CARD_STYLE),
        html.Div([html.H2(agency_count.shape[0]), html.Label(
            "Request Agency")], style=INDICATOR_CARD_STYLE)
        ], style=EQUAL_SPACE_BOX_STYLE),

    html.Div(html.Br(), style={"height": "3vh"}),

    html.Div([
        html.Div(dcc.Graph(id='med_days_to_close_box_plot', figure=med_days_to_close_box_plot, responsive=True, style={
                 "width": "60vw", "height": "60vh"}), style=BORDER_STYLE),
        html.Div(dcc.Graph(id='req_share_by_agency_pie_chart', figure=req_share_by_agency_pie_chart, className="half-graph",
                 responsive=True, style={"width": "35vw", "height": "60vh"}), style=BORDER_STYLE)
    ], className="graph-row", style=EQUAL_SPACE_BOX_STYLE),

    html.Div(html.Br(), style={"height": "2vh"}),

    # Part 2 of dashboard
    html.H1(TITLE + " Pt. 2"),
    html.Div([
        html.Div(dcc.Graph(id='num_req_by_day_bar_chart', figure=num_req_by_day_bar_chart, className="half-graph",
        style=TWO_CHART_STYLE), style=BORDER_STYLE),   # noqa
        html.Div(dcc.Graph(id='req_source_bar_chart', figure=req_source_bar_chart, className="half-graph",
                 responsive=True, style=TWO_CHART_STYLE), style=BORDER_STYLE)
    ], className="graph-row", style=EQUAL_SPACE_BOX_STYLE),

    html.Div(html.Br(), style={"height": "2vh"}),

    html.Div(dcc.Graph(id='req_by_nc_bar_chart', figure=req_by_nc_bar_chart, responsive=True,
             style={"height": "45vh"}), style=BORDER_STYLE)

])
