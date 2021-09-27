import datetime
import textwrap

import dash_core_components as dcc
import dash_html_components as html
import dash_table
import pandas as pd
import plotly.express as px
from app import app, batch_get_data
from config import API_HOST
from dash.dependencies import Input, Output
from design import CONFIG_OPTIONS, DISCRETE_COLORS, LABELS, apply_figure_style
from flask import request

pretty_columns = {
    'srnumber': "SR Number",
    'createdDate': "Created Date",
    'closedDate': "Closed Date",
    'typeName': "Type Name",
    'agencyName': "Agency Name",
    'sourceName': "Source Name",
    'address': "Address"
}

start_date = datetime.date.today() - datetime.timedelta(days=7)
end_date = datetime.date.today() - datetime.timedelta(days=1)

# TITLE
title = "NEIGHBORHOOD WEEKLY REPORT"

# DATA
df_path = f"/requests/updated?start_date={start_date}&end_date={end_date}"
print(" * Downloading data for dataframe")
df = batch_get_data(API_HOST + df_path)
df['createdDate'] = pd.to_datetime(
    df['createdDate'], errors='coerce').dt.strftime('%Y-%m-%d')
df['closedDate'] = pd.to_datetime(
    df['closedDate'], errors='coerce').dt.strftime('%Y-%m-%d')
print(" * Dataframe has been loaded")

try:
    selected_council = request.args.get('councilName') or 'Arleta'
except (RuntimeError):
    selected_council = 'Arleta'

table_df = df.query(f"councilName == '{selected_council}'")[['srnumber', 'createdDate', 'closedDate', 'typeName', 'agencyName', 'sourceName', 'address']]  # noqa
figure_df = df.query(f"councilName == '{selected_council}' and createdDate >= '{start_date}'").groupby(['createdDate', 'typeName'])['srnumber'].count().reset_index()  # noqa


# Populate the neighborhood dropdown
def populate_options():
    council_df_path = '/councils'
    council_df = pd.read_json(API_HOST + council_df_path)
    values = []
    for i in council_df.sort_values('councilName').councilName.unique():
        values.append({
            'label': i,
            'value': i
        })
    return values


fig = px.line(
    figure_df,
    x="createdDate",
    y="srnumber",
    color="typeName",
    color_discrete_sequence=DISCRETE_COLORS,
    labels=LABELS,
)

fig.update_xaxes(
    tickformat="%a\n%m/%d",
)

fig.update_traces(
    mode='markers+lines'
)  # add markers to lines

apply_figure_style(fig)

pie_fig = px.pie(
    figure_df,
    names="typeName",
    values="srnumber",
    color_discrete_sequence=DISCRETE_COLORS,
    labels=LABELS,
    hole=.3,
)
apply_figure_style(pie_fig)


# Layout
layout = html.Div([
    html.H1(title),
    dcc.Dropdown(
        id='council_list',
        clearable=False,
        value=selected_council,
        placeholder="Select a neighborhood",
        options=populate_options()
    ),
    html.Div(f"{selected_council} weekly report ({start_date.strftime('%b %d')} to {end_date.strftime('%b %d')})"),  # noqa
    html.Div([
        html.Div(
            [html.H2(id="created_txt"), html.Label("New Requests")],
            className="stats-label"
        ),
        html.Div(
            [html.H2(id="closed_txt"), html.Label("Closed Requests")],
            className="stats-label"
        ),
        html.Div(
            [html.H2(id="net_txt"), html.Label("Net Change")],
            className="stats-label"
        ),
    ], className="graph-row"),
    html.Div([
        html.Div(
            dcc.Graph(id='graph', figure=fig, config=CONFIG_OPTIONS),
            className="half-graph"
        ),
        html.Div(
            dcc.Graph(id='pie_graph', figure=pie_fig, config=CONFIG_OPTIONS),
            className="half-graph"
        )
    ]),
    html.Div(
        dash_table.DataTable(
            id='council_table',
            columns=[
                {"name": pretty_columns[i], "id": i} for i in table_df.columns
            ],
            style_as_list_view=True,
            style_cell={
                'padding': '5px',
                'textAlign': 'left',
                'fontFamily': 'Roboto, Arial',
                'fontSize': 12,
                'color': '#333333',
                'backgroundColor': '#EEEEEE',
            },
            style_header={
                'backgroundColor': 'white',
                'fontWeight': 'bold'
            },
            sort_action='native',
            # filter_action='native',
            page_size=20,
        )
    )
])


# Define callback to update graph
@app.callback(
    Output("council_table", "data"),
    Input("council_list", "value")
)
def update_table(selected_council):
    table_df = df.query(f"councilName == '{selected_council}'")[['srnumber', 'createdDate', 'closedDate', 'typeName', 'agencyName', 'sourceName', 'address']]  # noqa
    return table_df.to_dict('records')


@app.callback(
    [
        Output("created_txt", "children"),
        Output("closed_txt", "children"),
        Output("net_txt", "children"),
    ],
    Input("council_list", "value")
)
def update_text(selected_council):
    create_count = df.query(f"councilName == '{selected_council}' and createdDate >= '{start_date}'")['srnumber'].count()  # noqa
    close_count = df.query(f"councilName == '{selected_council}' and closedDate >= '{start_date}'")['srnumber'].count()  # noqa
    return create_count, close_count, create_count - close_count


@app.callback(
    Output("graph", "figure"),
    Input("council_list", "value")
)
def update_figure(selected_council):
    figure_df = df.query(f"councilName == '{selected_council}' and createdDate >= '{start_date}'").groupby(['createdDate', 'typeName'])['srnumber'].count().reset_index()  # noqa
    figure_df.typeName = figure_df.typeName.map(lambda x: '<br>'.join(textwrap.wrap(x, width=16)))  # noqa

    fig = px.line(
        figure_df,
        x="createdDate",
        y="srnumber",
        color="typeName",
        color_discrete_sequence=DISCRETE_COLORS,
        labels=LABELS,
        title="New Requests"
    )
    fig.update_xaxes(
        tickformat="%a\n%m/%d",
    )
    fig.update_traces(
        mode='markers+lines'
    )  # add markers to lines

    apply_figure_style(fig)

    return fig


@app.callback(
    Output("pie_graph", "pie_fig"),
    Input("council_list", "value")
)
def update_council_figure(selected_council):
    pie_df = df.query(f"councilName == '{selected_council}' and createdDate >= '{start_date}'").groupby(['typeName']).agg('count').reset_index()  # noqa

    pie_fig = px.pie(
        pie_df,
        names="typeName",
        values="srnumber",
        color_discrete_sequence=DISCRETE_COLORS,
        labels=LABELS,
    )

    apply_figure_style(pie_fig)

    return pie_fig
