import datetime
import textwrap

from dash import dcc, html
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go

from config import API_HOST
from design import CONFIG_OPTIONS, DISCRETE_COLORS, DISCRETE_COLORS_MAP, LABELS, apply_figure_style

# TITLE
title = "RECENT 311 REQUESTS"

# DATA
start_date = datetime.date.today() - datetime.timedelta(days=30)
end_date = datetime.date.today() - datetime.timedelta(days=1)

query_string = f"/reports?filter=created_date>={start_date}&filter=created_date<={end_date}"  # noqa
print(" * Downloading data for dataframe")
df = pd.read_json(API_HOST + query_string)
print(" * Dataframe has been loaded")

# FIGURES
report_df = df.groupby(['created_date', 'type_name']).agg('sum').reset_index()
report_df.type_name = report_df.type_name.map(lambda x: '<br>'.join(textwrap.wrap(x, width=16)))  # noqa

# Line Graph
numCreatedReqLineChart = px.line(
    report_df,
    x="created_date",
    y="counts",
    color="type_name",
    color_discrete_sequence=DISCRETE_COLORS,
    color_discrete_map=DISCRETE_COLORS_MAP,
    labels=LABELS,
)

numCreatedReqLineChart.update_xaxes(
    tickformat="%a\n%m/%d",
)

numCreatedReqLineChart.update_traces(
    mode='markers+lines'
)  # add markers to lines

# Pie Chart
pie_df = df.groupby(['type_name']).agg('sum').reset_index()
recentReqTypeSharePieChart = px.pie(
    pie_df,
    names="type_name",
    values="counts",
    color="type_name",
    color_discrete_sequence=DISCRETE_COLORS,
    color_discrete_map=DISCRETE_COLORS_MAP,
    labels=LABELS,
    hole=.3,
)

df['created_date'] = pd.to_datetime(df['created_date'])
dow_df = df.groupby(['created_date']).agg('sum').reset_index()
dow_df['day_of_week'] = dow_df['created_date'].dt.day_name()
numReqByDayOfWeekBarChart = px.bar(
    dow_df,
    x="day_of_week",
    y="counts",
    color_discrete_sequence=DISCRETE_COLORS,
    labels=LABELS,
)

apply_figure_style(numCreatedReqLineChart)
apply_figure_style(recentReqTypeSharePieChart)
apply_figure_style(numReqByDayOfWeekBarChart)

# LAYOUT
layout = html.Div([
    html.H1(title),
        html.P("The figures below represent the total number of 311 requests made across LA County over the past 30 days.", style={'padding':'20px', 'font-size':'18px', 'font-style':'italic'}),
    html.Div([
        html.Div([html.H2(f"{report_df['counts'].sum():,}"), html.Label("Total Requests")], className="stats-label"),  # noqa
        html.Div([html.H2(f"{start_date.strftime('%b %d')}"), html.Label("Report Start Date")], className="stats-label"),  # noqa
        html.Div([html.H2(f"{end_date.strftime('%b %d')}"), html.Label("Report End Date")], className="stats-label"),  # noqa
    ], className="graph-row", style={'color':'white'}),
    dcc.Graph(id='graph', figure=numCreatedReqLineChart, config=CONFIG_OPTIONS),
    html.Div([
        dcc.Graph(id='numReqByDayOfWeekBarChart', figure=numReqByDayOfWeekBarChart, config=CONFIG_OPTIONS, className="half-graph"),  # noqa
        dcc.Graph(id='recentReqTypeSharePieChart', figure=recentReqTypeSharePieChart, config=CONFIG_OPTIONS, className="half-graph"),  # noqa
    ], className="graph-row"),
])
