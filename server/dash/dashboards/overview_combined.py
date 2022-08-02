import textwrap
import datetime
import urllib.parse
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from dash import dcc, html

from config import API_HOST
from design import LABELS

# COMMON VARIABLES.
AGENCY_NAME_FIELD = 'agency_name'
COUNCIL_NAME_FIELD = 'council_name'
CREATED_DATE_FILTER = 'created_date>=2016-01-01'
CREATED_YEAR_FIELD = 'created_year'
NON_TOP4_INDEX_START = 4
REPORT_API_PATH_ROOT = "/reports?"
REQ_TYPE_STATS_API_PATH  = '/types/stats'
SOURCE_NAME_FIELD = 'source_name'
TITLE = "OVERVIEW COMBINED DASHBOARD"
TYPE_NAME_FIELD = 'type_name'


# HELPER FUNCTIONS.
def generate_dataframe_from_api(api_params, group_by_col):
    """Generates the dataframe output from the reports API.

    This function takes the "api_params" dictionary and "group_by_col" string and outputs the relevant fields
    in the raw dataframe and groupby dataframe from the reports API.
    
    Args:
        api_params: a dictionary of parameters for calling the API.
        group_by_col: the column name we use to groupby and output the result_counts_df dataframe.
    
    Returns: 
        result_df: the raw dataframe from calling the api with parameters from "api_params".
        result_counts_df: dataframe output from result_df group by the column "group_by_col" and aggregating the sum.
    """
    DATA_API_PATH = REPORT_API_PATH_ROOT + urllib.parse.urlencode(api_params)
    print(" * Downloading data from API path: " + DATA_API_PATH)
    result_df = pd.read_json(API_HOST + DATA_API_PATH)
    result_counts_df = result_df.groupby([group_by_col])['counts'].sum().sort_values().to_frame()
    print(" * Dataframe has been loaded from API path: " + DATA_API_PATH)
    return result_df, result_counts_df

# DATA

# Loading the dataframe for the NCs and corresponding requests.
nc_req_count_api_params = {'field': 'council_name', 'filter': CREATED_DATE_FILTER}
_, nc_req_count_df = generate_dataframe_from_api(nc_req_count_api_params, COUNCIL_NAME_FIELD)

# Loading the data for the number of new requests.
new_req_count_api_params = {'field': 'created_year', 'filter': CREATED_DATE_FILTER}
_, new_req_count_df = generate_dataframe_from_api(new_req_count_api_params, CREATED_YEAR_FIELD)

# Loading the count of each request types overall.
req_count_api_params = {'field': 'type_name', 'filter': CREATED_DATE_FILTER}
req_count_df, req_count = generate_dataframe_from_api(new_req_count_api_params, TYPE_NAME_FIELD)

# Loading the total number of request source.
req_source_count_api_params = {'field': 'source_name', 'filter': CREATED_DATE_FILTER}
req_source_count_df, req_source_count = generate_dataframe_from_api(req_source_count_api_params, SOURCE_NAME_FIELD)

# Loading the number of Request Agencies.
req_agency_count_api_params = {'field': 'agency_name', 'filter': CREATED_DATE_FILTER}
req_agency_count_df, agency_count = generate_dataframe_from_api(req_agency_count_api_params, AGENCY_NAME_FIELD)

# Request Share by Agency Pie Chart.
req_agency_count_df = agency_count
req_agency_count_df.sort_values('counts', ascending=False, inplace=True)
req_agency_count_df.loc['Others'] = req_agency_count_df[NON_TOP4_INDEX_START:].sum()
req_agency_count_df.sort_values('counts', ascending=False, inplace=True)
req_agency_count_df = req_agency_count_df[:NON_TOP4_INDEX_START + 1]
req_agency_count_df.index = req_agency_count_df.index.map(lambda x: '<br>'.join(textwrap.wrap(x, width=16)))

req_share_by_agency_pie_chart = px.pie(
    req_agency_count_df,
    names=req_agency_count_df.index,
    values='counts',
    labels=LABELS,
    hole=.3,
    title="Total Requests by Agency",
)
req_share_by_agency_pie_chart.update_layout(margin=dict(l=100, r=100, b=100, t=100))

# Request Type by Source Bar Chart.
req_source_count_df = req_source_count
req_source_count_df.sort_values('counts', ascending=False, inplace=True)
req_source_count_df.loc['Others'] = req_source_count_df[NON_TOP4_INDEX_START:].sum()
req_source_count_df.sort_values('counts', ascending=False, inplace=True)
req_source_count_df = req_source_count_df[:NON_TOP4_INDEX_START + 1]

req_source_bar_chart = px.bar(
    req_source_count_df,
    y=req_source_count_df.index,
    x='counts',
    title="Total Requests by Source",
    orientation='h'
)

# Median Request Days to Close Box Plot.
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

# Day of Week Bar Chart.
start_date = datetime.date.today() - datetime.timedelta(days=365)
end_date = datetime.date.today() - datetime.timedelta(days=1)
date_range_req_data_params = {'filter':f"created_date>={start_date}", 'filter':f"created_date<={end_date}"}
date_range_req_df, _ = generate_dataframe_from_api(date_range_req_data_params, 'created_date')
date_range_req_df['created_date'] = pd.to_datetime(date_range_req_df['created_date'])
date_range_req_df['day_of_week'] = date_range_req_df['created_date'].dt.day_name()
day_of_week_df = date_range_req_df.groupby(['day_of_week']).agg('sum').reset_index()

num_req_by_day_bar_chart = px.bar(
    day_of_week_df,
    x="day_of_week",
    y="counts",
    labels=LABELS,
)
num_req_by_day_bar_chart.update_xaxes(categoryorder='array', categoryarray=[
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"])

# Total Request by NC.
req_by_nc_bar_chart = px.bar(
    nc_req_count_df,
    x=nc_req_count_df.index,
    y='counts',
    labels=LABELS,
    title="Total Requests by Neighborhood Councils",
)
req_by_nc_bar_chart.update_layout(font=dict(size=12))

# LAYOUT VARIABLES.
INDICATOR_CARD_STYLE = {"text-align": 'center',
    "border": "0.5px black solid", 'width': '18vw', 'display': 'inline-block'}
BORDER_STYLE = {"border": "0.5px black solid"}
EQUAL_SPACE_BOX_STYLE = {'display': 'flex', "justify-content": "space-between"}
TWO_CHART_STYLE = {"width": "48vw", "height": "40vh"}
DASHBOARD_OUTLINE = """The figures below represent the total number of 311 requests made 
across LA County from 2016-2021. In 2020, we saw an all-time high with more than 1.4 million requests."""

# LAYOUT.
layout = html.Div([

    # Dashboard showing summary statistics, median time to close box plot, and request share by agency.
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

    # Bar charts showing number of requests by day, number of requests by source, and number of requests by NCs.
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
