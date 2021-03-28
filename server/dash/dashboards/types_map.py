from urllib.request import urlopen
import json
import datetime
import pandas as pd
import plotly.express as px
import dash_core_components as dcc
import dash_html_components as html
from dash.dependencies import Input, Output

from app import app
from config import API_HOST
from design import CONFIG_OPTIONS, LABELS, apply_figure_style


# TITLE
title = "REQUEST TYPE MAP"

# DATA
start_date = datetime.date.today() - datetime.timedelta(days=365)
print(" * Downloading data for dataframe")
report_df = pd.read_json(f"{API_HOST}/reports?field=council_name&field=type_name&filter=created_date>={start_date}")  # noqa

print(" * Downloading geojson")
with urlopen(f"{API_HOST}/geojson") as response:
    nc_geojson = json.load(response)


# REPORT
def populate_options():
    values = []
    for i in report_df.type_name.sort_values().unique():
        values.append({
            'label': i,
            'value': i
        })
    return values


layout = html.Div([
    html.H1(title),
    dcc.Dropdown(
        id="types",
        clearable=False,
        value="Illegal Dumping",
        placeholder="Select a type",
        searchable=False,
        options=populate_options(),
    ),
    dcc.Graph(id="choropleth", config=CONFIG_OPTIONS, className="hidden-graph"),
])


@app.callback(
    Output("choropleth", "figure"),
    Output("choropleth", "className"),
    [Input("types", "value")]
)
def display_choropleth(selected_value):
    fig = px.choropleth(
        report_df.query(f"type_name == '{selected_value}'"),
        geojson=nc_geojson,
        locations="council_name",
        featureidkey="properties.council_name",
        color="counts",
        color_continuous_scale=px.colors.sequential.YlOrRd,
        labels=LABELS,
        projection="mercator",
        height=1000,
    )
    # show only the relevant map
    fig.update_geos(
        fitbounds="locations",
        visible=False,
    )
    # crops/zooms it
    fig.update_layout(
        margin={"r": 0, "t": 0, "l": 0, "b": 0},
    )
    # move the scale to bottom left
    fig.update_coloraxes(
        # showscale=False
        colorbar_x=0.25,
        colorbar_y=0.25,
        colorbar_ypad=15,
        colorbar_lenmode="fraction",
        colorbar_len=0.25,
    )
    apply_figure_style(fig)
    return fig, "visible-graph"
