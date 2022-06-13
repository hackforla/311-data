import datetime
import textwrap
import json
import urllib

from dash import dcc, html, dash_table, callback
import pandas as pd
import plotly.express as px
#from app import app, batch_get_data
from config import API_HOST
from dash.dependencies import Input, Output
from design import CONFIG_OPTIONS, DISCRETE_COLORS, DISCRETE_COLORS_MAP, LABELS, apply_figure_style
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

BATCH_SIZE = 10000

def batch_get_data(url):
    # set up your query
    if '?' in url:
        batch_url = f"{url}&limit={BATCH_SIZE}"
    else:
        batch_url = f"{url}?limit={BATCH_SIZE}"

    response_size = BATCH_SIZE
    result_list = []
    skip = 0

    # loop through query results and add to a list (better performance!)
    while (response_size == BATCH_SIZE):
        batch = json.loads(urllib.request.urlopen(f"{batch_url}&skip={skip}").read())
        result_list.extend(batch)
        response_size = len(batch)
        skip = skip + BATCH_SIZE

    # convert JSON object list to dataframe
    df = pd.DataFrame.from_records(result_list)

    return df


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
    color_discrete_map=DISCRETE_COLORS_MAP,
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
    color="typeName",
    color_discrete_sequence=DISCRETE_COLORS,
    color_discrete_map=DISCRETE_COLORS_MAP,
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
    html.Div(f"Weekly report ({start_date.strftime('%b %d')} to {end_date.strftime('%b %d')})"),  # noqa
    html.Div([
        html.Div(
            [html.H2(id="numNewRequests"), html.Label("New Requests")],
            className="stats-label"
        ),
        html.Div(
            [html.H2(id="numClosedRequests"), html.Label("Closed Requests")],
            className="stats-label"
        ),
        html.Div(
            [html.H2(id="closeMinusNew"), html.Label("Net Change")],
            className="stats-label"
        ),
    ], className="graph-row"),
    html.Div([
        html.Div(
            dcc.Graph(id='newRequestsLineChart', figure=fig, config=CONFIG_OPTIONS),
            className="half-graph"
        ),
        html.Div(
            dcc.Graph(id='neighRecentReqTypePieChart', figure=pie_fig, config=CONFIG_OPTIONS),
            className="half-graph"
        )
    ]),
    html.Div(
        dash_table.DataTable(
            id='neighCouncilTbl',
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
@callback(
    Output("neighCouncilTbl", "data"),
    Input("council_list", "value")
)
def update_table(selected_council):
    table_df = df.query(f"councilName == '{selected_council}'")[['srnumber', 'createdDate', 'closedDate', 'typeName', 'agencyName', 'sourceName', 'address']]  # noqa
    return table_df.to_dict('records')


@callback(
    [
        Output("numNewRequests", "children"),
        Output("numClosedRequests", "children"),
        Output("closeMinusNew", "children"),
    ],
    Input("council_list", "value")
)
def update_text(selected_council):
    create_count = df.query(f"councilName == '{selected_council}' and createdDate >= '{start_date}'")['srnumber'].count()  # noqa
    close_count = df.query(f"councilName == '{selected_council}' and closedDate >= '{start_date}'")['srnumber'].count()  # noqa
    return create_count, close_count, create_count - close_count


@callback(
    Output("newRequestsLineChart", "figure"),
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
        title="Number of new " + selected_council + " Requests"
    )
    fig.update_xaxes(
        tickformat="%a\n%m/%d",
    )
    fig.update_traces(
        mode='markers+lines'
    )  # add markers to lines

    apply_figure_style(fig)

    return fig


@callback(
    Output("neighRecentReqTypePieChart", "pie_fig"),
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
        title="Share of new requests types for " + selected_council
    )

    apply_figure_style(pie_fig)

    return pie_fig
