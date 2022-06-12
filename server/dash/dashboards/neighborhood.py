import textwrap

import dash_core_components as dcc
import dash_html_components as html
import pandas as pd
import plotly.express as px
from dash.dependencies import Input
from dash.dependencies import Output

from app import app
from config import API_HOST
from design import apply_figure_style
from design import CONFIG_OPTIONS
from design import DISCRETE_COLORS
from design import LABELS


# TITLE
title = "NEIGHBORHOODS"


# DATA
print(" * Downloading data for dataframe")
query_string = '/reports?field=type_name&field=council_name&field=created_date'
df = pd.read_json(API_HOST + query_string)
print(" * Dataframe has been loaded")

df["created_date"] = pd.to_datetime(df['created_date'])

fig = px.line()
apply_figure_style(fig)


def populate_options():
    values = []
    for i in df.sort_values('council_name').council_name.unique():
        values.append(
            {
                'label': i,
                'value': i
            }
        )
    return values


# Define callback to update graph
@app.callback(
    Output('graph1', 'figure'),
    [Input("council_list", "value"),
    Input("data_type", "value")]
)
def update_figure(selected_council, select_timeframe):
    neighborhood_sum_df = df[df.council_name == selected_council].groupby(['created_date']).agg('sum').reset_index()  # noqa
    total_sum_df = df.groupby(['created_date']).agg('sum').reset_index()

    total_sum_df['nc_ma'] = total_sum_df.counts.rolling(select_timeframe).mean()/99
    neighborhood_sum_df['select_nc_ma'] = neighborhood_sum_df.counts.rolling(select_timeframe).mean()
    
    merged_df = pd.merge(neighborhood_sum_df, total_sum_df, on=["created_date", "created_date"])
    
    fig = px.line(
        merged_df,
        x="created_date",
        y=['select_nc_ma', 'nc_ma'],
        color_discrete_sequence=DISCRETE_COLORS,
        labels={
            "created_date": "311 Request Date",
            "value": "Total Requests"
                },
        title=selected_council + " vs 99 Neighborhood Councils 311 Requests Average"
    )
    newnames = {
        "select_nc_ma": selected_council, 
        "nc_ma": "99 Neighborhood Councils Average"
    }
    fig.for_each_trace(lambda t: t.update(name = newnames[t.name],
                                      legendgroup = newnames[t.name],
                                      hovertemplate = t.hovertemplate.replace(t.name, newnames[t.name])
                                     )
    )

    fig.update_xaxes(
        tickformat="%a\n%m/%d",
    )

    fig.update_yaxes(
        rangemode="tozero"
    )

    fig.update_traces(
        mode='markers+lines'
    )  # add markers to lines

    apply_figure_style(fig)

    return fig


# Define callback to update graph
@app.callback(
    Output('graph2', 'figure'),
    [Input("council_list", "value")]
)
def update_council_figure(selected_council):

    report_df = df[df.council_name == selected_council].groupby(['created_date', 'type_name']).agg('sum').reset_index()  # noqa
    report_df.type_name = report_df.type_name.map(lambda x: '<br>'.join(textwrap.wrap(x, width=16)))  # noqa

    fig = px.line(
        report_df,
        x="created_date",
        y="counts",
        color="type_name",
        color_discrete_sequence=DISCRETE_COLORS,
        labels=LABELS,
        title="Request type trend for " + selected_council
    )

    fig.update_xaxes(
        tickformat="%a\n%m/%d",
    )

    fig.update_traces(
        mode='markers+lines'
    )  # add markers to lines

    apply_figure_style(fig)

    return fig


layout = html.Div(children=[
    
    html.Div([
        html.H1(title),
        dcc.Dropdown(
            id='council_list',
            clearable=False,
            value="Arleta",
            placeholder="Select a neighborhood",
            options=populate_options()
        ),
    ]),

    html.Div(children=[
        dcc.Graph(
            id='graph1',
            figure=fig,                
            config=CONFIG_OPTIONS
        ),
    ]),

    html.Div([
        html.Div(children=[
            html.Label('Moving Average Time Frame'),
        ], style={'padding': 10, 'flex': 1}),
        html.Div(children=[
            dcc.RadioItems(
                id='data_type',
                options=[
                    {'label': '1 Day', 'value': 1},
                    {'label': '7 Day', 'value': 7},
                    {'label': '30 Day', 'value': 30},
                ],
                value=1.
            ),
        ], style={'padding': 10, 'flex': 1}),
    ], style={'display': 'flex', 'flex-direction': 'row'}),

    html.Div([
        dcc.Graph(
            id='graph2',
            figure=fig,
            config=CONFIG_OPTIONS
        ),
    ]),
])

