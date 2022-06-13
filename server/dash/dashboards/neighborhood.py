import textwrap

from dash import Dash, dcc, html, callback
import pandas as pd
import plotly.express as px
from dash.dependencies import Input, Output

# from app import app
from config import API_HOST
from design import CONFIG_OPTIONS,  DISCRETE_COLORS, DISCRETE_COLORS_MAP, LABELS, apply_figure_style

# TITLE
title = "NEIGHBORHOODS"

# DATA
print(" * Downloading data for dataframe")
query_string = '/reports?field=type_name&field=council_name&field=created_date'
df = pd.read_json(API_HOST + query_string)
print(" * Dataframe has been loaded")

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


layout = html.Div([
    html.H1(title),
    dcc.Dropdown(
        id='council_list',
        clearable=False,
        value="Arleta",
        placeholder="Select a neighborhood",
        options=populate_options()
    ),
    dcc.Graph(
        id='ncAvgCompLineChart',
        figure=fig,
        config=CONFIG_OPTIONS
    ),
    dcc.Graph(
        id='ncNumReqTypeLineChart',
        figure=fig,
        config=CONFIG_OPTIONS
    )
])





# Define callback to update graph
@callback(
    Output('ncAvgCompLineChart', 'figure'),
    [Input("council_list", "value")]
)
def update_figure(selected_council):
    neighborhood_sum_df = df[df.council_name == selected_council].groupby(['created_date']).agg('sum').reset_index()  # noqa
    total_sum_df = df.groupby(['created_date']).agg('sum').reset_index()
    total_sum_df["nc_avg"] = total_sum_df["counts"] / 99
    merged_df = neighborhood_sum_df.merge(total_sum_df["nc_avg"].to_frame(), left_index=True, right_index=True)  # noqa

    fig = px.line(
        merged_df,
        x="created_date",
        y=['counts', 'nc_avg'],
        color_discrete_sequence=DISCRETE_COLORS,
        labels=LABELS,
        title= "Number of " + selected_council + " Requests compare with the average of all Neighborhood Councils requests"
    )

    fig.update_xaxes(
        tickformat="%a\n%m/%d",
    )

    fig.update_traces(
        mode='markers+lines'
    )  # add markers to lines

    apply_figure_style(fig)

    return fig


# Define callback to update graph
@callback(
    Output('ncNumReqTypeLineChart', 'figure'),
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
        color_discrete_map=DISCRETE_COLORS_MAP,
        labels=LABELS,
        title="Number of Different Requests Types for " + selected_council
    )

    fig.update_xaxes(
        tickformat="%a\n%m/%d",
    )

    fig.update_traces(
        mode='markers+lines'
    )  # add markers to lines

    apply_figure_style(fig)

    return fig


