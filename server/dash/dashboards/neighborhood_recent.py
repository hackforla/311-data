import datetime
import textwrap

import dash_core_components as dcc
import dash_html_components as html
import dash_table
from dash.dependencies import Input, Output
import pandas as pd
import plotly.express as px
from flask import request

from app import app, batch_get_data
from config import API_HOST
from design import CONFIG_OPTIONS, DISCRETE_COLORS, LABELS, apply_figure_style, DISCRETE_COLORS_MAP


pretty_columns = {
    'srnumber': "SR Number",
    'createdDate': "Created Date",
    'closedDate': "Closed Date",
    'typeName': "Type Name",
    'agencyName': "Agency Name",
    'sourceName': "Source Name",
    'address': "Address"
}

START_DATE_DELTA = 7
END_DATE_DELTA = 1
start_date = datetime.date.today() - datetime.timedelta(days=START_DATE_DELTA)
end_date = datetime.date.today() - datetime.timedelta(days=END_DATE_DELTA)

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

req_type_line_base_graph = px.line()
apply_figure_style(req_type_line_base_graph)

req_type_pie_base_graph = px.pie()
apply_figure_style(req_type_pie_base_graph)

# Populate the neighborhood dropdown
def populate_options():
    """Gets a list of neighborhood councils to populate the dropdown menu.

    This function calls the councils API to get a list of neighborhood council and 
    return a unique list of council as a dictionary sorted in ascending order of requests.
    
    Returns:
        A list of dictionaries mapping label and value to corresponding councilName ordered by the 
        total number of requests. For example:

        [
            {'label': 'Arleta', 'value': 'Arleta'},
            {'label': 'Arroyo Seco', 'value': 'Arroyo Seco'},
            ...
        ]
    
    Typical usage example:

        dcc.Dropdown(
            ...
            options=populate_options()
            ...
        )
    """
    council_df_path = '/councils'
    council_df = pd.read_json(API_HOST + council_df_path)
    values = []
    for i in council_df.sort_values('councilName').councilName.unique():
        values.append({
            'label': i,
            'value': i
        })
    return values


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
            dcc.Graph(id='graph', figure=req_type_line_base_graph, config=CONFIG_OPTIONS),
            className="half-graph"
        ),
        html.Div(
            dcc.Graph(id='pie_graph', figure=req_type_pie_base_graph, config=CONFIG_OPTIONS),
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
    """Filters the LA 311 request data table based on selected_council.

    This function takes the selected neighborhood council (nc) value from the "council_list" dropdown and 
    outputs a list of requests associated with that nc as a data table in dictionary form 
    with id "council_table" in the layout. 

    Args:
        selected_council: A string argument automatically detected by Dash callback function when "council_list" element is selected in the layout.

    Returns: 
        A list of dictionaries mapping column names to values. For example: [{'srnumber':1234567, 'createdDate':'2022-07-11', 'closeDate':'2022-07-14'...}, {...}, ... ]
    
    Typical usage example:

        dash_table.DataTable(
            id='council_table',
            ...
        )
    """
    table_df = df.query(f"councilName == '{selected_council}'")[['srnumber', 'createdDate', 'closedDate', 'typeName', 'agencyName', 'sourceName', 'address']]  # noqa

    # The following check is to ensure Dash graphs are populated with dummy data when query returns empty dataframe.
    if table_df.shape[0] == 0:
        table_df = pd.DataFrame(columns=["Request Type"])
        for i, request_type in enumerate(DISCRETE_COLORS_MAP):
            table_df.loc[i] = [request_type]
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
    """Updates the indicator cards based on data filtered by selected_council.

    This function takes the selected neighborhood council (nc) value from the "council_list" dropdown and 
    outputs the values for the number of new requests, number of closed requests, and net change in requests
    (i.e. # closed requests - # new requests) for visualizations on the indicator visuals in the layout. The 
    corresponding IDs of the indicator visuals are "created_txt", "closed_txt", and "net_txt".

    Args:
        selected_council: a string argument automatically detected by Dash callback function when "council_list" element is selected in the layout.
    
    Returns:
        A tuple containing three integers:
            1) Integer for the number of new requests created since the start date.
            2) Integer for the number of close requests since the start date.
            3) Integer for the difference in close requests and new requests since the start date.
    
    Typical usage example (using net_txt as example, created_txt and closed_txt are similar):

        html.Div(
            [html.H2(id="net_txt"), html.Label("Net Change")],
            className="stats-label"
        )    
    """
    create_count = df.query(f"councilName == '{selected_council}' and createdDate >= '{start_date}'")['srnumber'].count()  # noqa
    close_count = df.query(f"councilName == '{selected_council}' and closedDate >= '{start_date}'")['srnumber'].count()  # noqa

    # This check is to ensure data quality issues don't flow downstream to the dashboard (i.e., closed requests exist without any new requests).
    if create_count == 0 and close_count > 0:
        return 0, 0, 0
    else:
        return create_count, close_count, close_count - create_count 


@app.callback(
    Output("graph", "figure"),
    Input("council_list", "value")
)
def update_figure(selected_council):
    """Updates the Request Type Line Chart based on data filtered by selected_council.

    This function takes the selected neighborhood council (nc) value from the "council_list" dropdown and 
    outputs the request type line chart that shows the trend of of different requests types over
    the time range of the data available in the selected neighborhood conucil. The line chart will
    show up inside dcc.Graph object as long as id "graph" is passed in.

    Args:
        selected_council: a string argument automatically detected by Dash callback function when "council_list" element is selected in the layout.
    
    Returns:
        Plotly line chart of the total number of requests over time (createdDate) separated by request type.
    
    Typical usage example:

        html.Div(
                    dcc.Graph(id='graph', 
                    ...
                )
    """
    figure_df = df.query(f"councilName == '{selected_council}' and createdDate >= '{start_date}'").groupby(['createdDate', 'typeName'])['srnumber'].count().reset_index()  # noqa

    # The following check is to ensure Dash graphs are populated with dummy data when query returns empty dataframe.
    if figure_df.shape[0] == 0:
        figure_df = pd.DataFrame(columns=["createdDate", "srnumber", "typeName"])
        for j in range(START_DATE_DELTA):
            for request_type in DISCRETE_COLORS_MAP:
                figure_df.loc[figure_df.shape[0]] = [start_date + datetime.timedelta(days=j), 0, request_type]
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
    Output("pie_graph", "figure"),
    Input("council_list", "value")
)
def update_council_figure(selected_council):
    """Updates the Request Type Pie Chart based on data filtered by selected_council.

    This function takes the selected neighborhood council (nc) value from the "council_list" dropdown and 
    outputs the the pie chart showing the share of each request types. The pie chart will
    show up inside dcc.Graph object as long as id "pie_graph" is passed in.

    Args:
        selected_council: a string argument automatically detected by Dash callback function when "council_list" element is selected in the layout.
    
    Returns:
        Plotly pie chart for the share of different request types.

    Typical usage example:

        html.Div(
                    dcc.Graph(id='pie_graph', 
                    ...
                )
    """
    pie_df = df.query(f"councilName == '{selected_council}' and createdDate >= '{start_date}'").groupby(['typeName']).agg('count').reset_index()  # noqa

    # The following check is to ensure Dash graphs are populated with dummy data when query returns empty dataframe.
    if pie_df.shape[0] == 0:
        pie_df = pd.DataFrame(columns=["srnumber", "typeName"])
        for i, request_type in enumerate(DISCRETE_COLORS_MAP):
            pie_df.loc[i] = [1, request_type]
    pie_fig = px.pie(
        pie_df,
        names="typeName",
        values="srnumber",
        color_discrete_sequence=DISCRETE_COLORS,
        labels=LABELS,
    )

    apply_figure_style(pie_fig)

    return pie_fig
