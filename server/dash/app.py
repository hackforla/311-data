from dash import Dash, dcc, html

external_stylesheets = ['/static/reports.css']
# Suppress Callback Exceptions due to multi-page Dashboard layout, some callback id may not exist initially
app = Dash(__name__, external_stylesheets=external_stylesheets, suppress_callback_exceptions=True)

# set up default layout
app.layout = html.Div([
    dcc.Location(id='url', refresh=False),
    html.Div(id='page-content')
])
