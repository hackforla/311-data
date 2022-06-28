import textwrap
import datetime
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from dash import callback, dcc, html
from dash.dependencies import Input, Output

from config import API_HOST
from design import CONFIG_OPTIONS, DISCRETE_COLORS, DISCRETE_COLORS_MAP, LABELS, apply_figure_style

title = "OVERVIEW COMBINED DASHBOARD"

# DATA
print(" * Downloading data for dataframe")
query_string = '/reports?field=type_name&field=council_name&field=created_date'
df = pd.read_json(API_HOST + query_string)
print(" * Dataframe has been loaded")

# Loading the dataframe for the NCs and correspoding requests
print(" * Downloading data for dataframe")
query_string = "/reports?field=council_name&filter=created_date>=2016-01-01"
df1 = pd.read_json(API_HOST + query_string)
df1 = df1.groupby(['council_name'])['counts'].sum().sort_values().to_frame()

# Loading the data for the number of new requests
print(" * Downloading data for dataframe")
query_string = "/reports?field=created_year&filter=created_date>=2016-01-01"
df2 = pd.read_json(API_HOST + query_string)
df2 = df2.groupby(['created_year'])['counts'].sum().to_frame()

# Loading the count of each request types overall
print(" * Downloading data for dataframe")
query_string = "/reports?field=type_name&filter=created_date>=2016-01-01"
df3 = pd.read_json(API_HOST + query_string)
df3 = df3.groupby(['type_name'], as_index=False)['counts'].sum()

# Loading the total number of requests
# start_date = datetime.date.today() - datetime.timedelta(days=200)
# df_path = f"/requests/updated?start_date={start_date}"
# df4 = pd.read_json(df_path)
# df4.loc[:, 'createDateDT'] = pd.to_datetime(
#     df4.loc[:, 'createdDate'].str[:-4].str.split("T").str.join(" "))
# df4.loc[:, 'closeDateDT'] = pd.to_datetime(
#     df4.loc[:, 'closedDate'].str[:-4].str.split("T").str.join(" "))
# df4.loc[:, 'timeToClose'] = (df4.loc[:, 'closeDateDT'] - df4.loc[:, 'createDateDT']).dt.days
# df4.loc[:, "timeToClose"] = df4.loc[:, "timeToClose"].fillna(0.0000001)


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
    color_discrete_sequence=DISCRETE_COLORS,
    labels=LABELS,
    hole=.3,
    title="Total Requests by Agency",
)
shareReqByAgencyPieChart.update_layout(margin=dict(l=125, r=125, b=125, t=125))
apply_figure_style(shareReqByAgencyPieChart)


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
    color_discrete_sequence=['#1D6996'],
    labels=LABELS,
    title="Total Requests by Source",
    orientation='h'
)
apply_figure_style(reqSourceBarchart)


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
    title="Total Median Days to Close by Type",
)
apply_figure_style(medDaysToCloseBoxPlot)

# LAYOUT
layout = html.Div([
    # Page 2 with Cards + Stuf
    html.H1(title),
    html.P("The figures below represent the total number of 311 requests made across LA County from 2016-2021. In 2020, we saw an all-time high with more than 1.4 million requests.",
           style={ 'font-size': '18px', 'font-style': 'italic'}),
    html.Div(children=[
        html.Div([
            html.Div([html.H2(f"{df2['counts'].sum():,}"), html.Label(
                "Total Requests")], style={"text-align": 'center', "border": "#666666 1px solid", 'width': '18vw'}),
            html.Div([html.H2(df1.shape[0] - 1), html.Label("Neighborhoods")],
                     style={"text-align": 'center', "border": "#666666 1px solid", 'width': '18vw'}),
            html.Div([html.H2(df3.shape[0]), html.Label("Request Types")], style={"text-align": 'center', "border": "#666666 1px solid", 'width': '18vw'})],
            style={"width": "57vw", 'display': 'flex', "justify-content": "space-between"})

        # ,
        # html.Div([dcc.Graph(
        #     id='reqSourceBarchart',
        #     figure=reqSourceBarchart,
        #     config=CONFIG_OPTIONS,
        #     className="half-graph",
        #     responsive=True,
        #     style={"width":"35vw", "height":"50vh","text-align":'center'}
        # )])

    ], style={'display': 'flex', "justify-content": "space-between"}
        # , className="graph-row"
    ),
    html.Div([
        dcc.Graph(
            id='medDaysToCloseBoxPlot',
            figure=medDaysToCloseBoxPlot,
            config=CONFIG_OPTIONS,
            responsive=True,
            style={"width": "57vw", "height": "70vh"}
        ),
        dcc.Graph(
            id='shareReqByAgencyPieChart',
            figure=shareReqByAgencyPieChart,
            config=CONFIG_OPTIONS,
            className="half-graph",
            responsive=True,
            style={"width": "35vw", "height": "70vh"}
        )

    ], className="graph-row")


])
