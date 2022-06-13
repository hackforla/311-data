import textwrap

from dash import dcc, html
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go

from config import API_HOST
from design import CONFIG_OPTIONS, DISCRETE_COLORS, DISCRETE_COLORS_MAP, LABELS, apply_figure_style


# TITLE
title = "311 DATA OVERVIEW"

# FIGURES
# council figure 
print(" * Downloading data for dataframe")
query_string = "/reports?field=council_name&filter=created_date>=2016-01-01"
df1 = pd.read_json(API_HOST + query_string)
df1 = df1.groupby(['council_name'])['counts'].sum().sort_values().to_frame()
reqByNcBarChart = px.bar(
    df1,
    x=df1.index,
    y='counts',
    color_discrete_sequence=DISCRETE_COLORS,
    labels=LABELS,
    title="Total Requests by Neighborhood Councils",
)

# year totals figure
print(" * Downloading data for dataframe")
query_string = "/reports?field=created_year&filter=created_date>=2016-01-01"
df2 = pd.read_json(API_HOST + query_string)
df2 = df2.groupby(['created_year'])['counts'].sum().to_frame()
numReqByYearBarChart = px.bar(
    df2,
    x=df2.index,
    y='counts',
    color_discrete_sequence=['#1D6996'],
    labels=LABELS,
    title="Total Requestes by Year",
)

# agency figure
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
    color_discrete_sequence=DISCRETE_COLORS,
    labels=LABELS,
    hole=.3,
    title="Total Requests by Agency",
)

# source figure
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
    x=df6.index,
    y='counts',
    color_discrete_sequence=['#1D6996'],
    labels=LABELS,
    title="Total Requests by Source",
)

# types figure
print(" * Downloading data for dataframe")
query_string = "/reports?field=type_name&filter=created_date>=2016-01-01"
df3 = pd.read_json(API_HOST + query_string)
df3 = df3.groupby(['type_name'], as_index=False)['counts'].sum()
reqTypeSharePieChart = px.pie(
    df3,
    names="type_name",
    values="counts",
    color_discrete_sequence=DISCRETE_COLORS,
    color="type_name",
    color_discrete_map=DISCRETE_COLORS_MAP,
    labels=LABELS,
    hole=.3,
    title="Total Requests by Type",
)
# fig3.update_layout(showlegend=False)

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
    title="Total Median Days to Close by Type",
)

# apply shared styles
apply_figure_style(reqByNcBarChart)
apply_figure_style(numReqByYearBarChart)
apply_figure_style(reqTypeSharePieChart)
apply_figure_style(medDaysToCloseBoxPlot)
apply_figure_style(shareReqByAgencyPieChart)
apply_figure_style(reqSourceBarchart)

# LAYOUT
layout = html.Div([
    html.H1(title),
    html.P("The figures below represent the total number of 311 requests made across LA County from 2016-2021. In 2020, we saw an all-time high with more than 1.4 million requests.", style={'padding':'20px', 'font-size':'18px', 'font-style':'italic'}),
    html.Div([
        html.Div([html.H2(f"{df2['counts'].sum():,}"), html.Label("Total Requests")], className="stats-label"),  # noqa
        html.Div([html.H2(df1.shape[0] - 1), html.Label("Neighborhoods")], className="stats-label"),  # noqa
        html.Div([html.H2(df3.shape[0]), html.Label("Request Types")], className="stats-label"),  # noqa
    ], className="graph-row"),
    html.Div([
        dcc.Graph(
            id='numReqByYearBarChart',
            figure=numReqByYearBarChart,
            config=CONFIG_OPTIONS,
            className="half-graph"
        ),
        dcc.Graph(
            id='reqTypeSharePieChart',
            figure=reqTypeSharePieChart,
            config=CONFIG_OPTIONS,
            className="half-graph"
        )],
        className="graph-row"),
    dcc.Graph(
        id='medDaysToCloseBoxPlot',
        figure=medDaysToCloseBoxPlot,
        config=CONFIG_OPTIONS,
        responsive=True,
    ),
    html.Div([
        dcc.Graph(
            id='shareReqByAgencyPieChart',
            figure=shareReqByAgencyPieChart,
            config=CONFIG_OPTIONS,
            className="half-graph",
            responsive=True,
        ),
        dcc.Graph(
            id='reqSourceBarchart',
            figure=reqSourceBarchart,
            config=CONFIG_OPTIONS,
            className="half-graph",
            responsive=True,
        )],
        className="graph-row"),
    dcc.Graph(
        id='reqByNcBarChart',
        figure=reqByNcBarChart,
        config=CONFIG_OPTIONS,
        responsive=True,
    ),
])
