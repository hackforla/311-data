# import pandas as pd
# import plotly.express as px
# from dash import callback, dcc, html
# from dash.dependencies import Input, Output

# from config import API_HOST
# from design import CONFIG_OPTIONS, DISCRETE_COLORS, DISCRETE_COLORS_MAP, LABELS, apply_figure_style


# title = "NEIGHBORHOODS"

# # DATA
# print(" * Downloading data for dataframe")
# query_string = '/reports?field=type_name&field=council_name&field=created_date'
# df = pd.read_json(API_HOST + query_string)
# print(" * Dataframe has been loaded")

# fig = px.line()
# apply_figure_style(fig)


# def populate_options():
#     values = []
#     for i in df.sort_values('council_name').council_name.unique():
#         values.append(
#             {
#                 'label': i,
#                 'value': i
#             }
#         )
#     return values


# # LAYOUT 
# layout = html.Div([
#     html.H1(title),
#     dcc.Dropdown(
#         id='council_list',
#         clearable=False,
#         value="Arleta",
#         placeholder="Select a neighborhood",
#         options=populate_options()
#     ),
#     dcc.Graph(
#         id='ncAvgCompLineChart',
#         figure=fig,
#         config=CONFIG_OPTIONS
#     ),
#     dcc.Graph(
#         id='ncNumReqTypeLineChart',
#         figure=fig,
#         config=CONFIG_OPTIONS
#     )
# ])
