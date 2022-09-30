from dash import Dash, dcc, html, Output, Input, callback
from dashboards import nc_summary_comparison, overview_combined
from flask import Flask

external_stylesheets = ['/static/reports.css']
# Suppress Callback Exceptions due to multi-page Dashboard layout, some callback id may not exist initially.
fl_serve = Flask(__name__)
app = Dash(__name__, external_stylesheets=external_stylesheets, suppress_callback_exceptions=True, server=fl_serve)
server = app.server
available_dashboards = ["nc_summary_comparison", "overview_combined"]

# set up default layout
app.layout = html.Div([
    dcc.Location(id='url', refresh=False),
    html.Div(id='page-content')
])

@callback(Output('page-content', 'children'),
              Input('url', 'pathname'))
def display_page(pathname):
    if pathname == '/nc_summary_comparison':
        return nc_summary_comparison.layout
    elif pathname == '/overview_combined':
        return overview_combined.layout
    else:
        return html.Div([
            dcc.Link(dashboard, href=f"/{dashboard}") for dashboard in available_dashboards 
        ], className='dash-links')

if __name__ == '__main__':
    #app.run_server(host='0.0.0.0', port='5500', debug=True)
    print("running host")
    app.run_server()
# else:
#     print("Not main")
#     app.run_server(host='0.0.0.0', port='5500', debug=True)