import flask
from dash import Dash, html, dcc

external_stylesheets = ['/static/reports.css']
server = flask.Flask(__name__) 
app = Dash(__name__, external_stylesheets=external_stylesheets, suppress_callback_exceptions=True, server=server)

# set up default layout
app.layout = html.Div([
    dcc.Location(id='url', refresh=False),
    html.Div(id='page-content')
])
