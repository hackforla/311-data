import dash
from dash import Dash, dcc, html

external_stylesheets = ['/static/reports.css']
# Suppress Callback Exceptions due to multi-page Dashboard layout, some callback id may not exist initially.
app = Dash(__name__, external_stylesheets=external_stylesheets,
           suppress_callback_exceptions=True, use_pages=True)

app.layout = html.Div([
    dcc.Location(id='url', refresh=False),
    dash.page_container
])

dash.register_page("home", path='/', layout=html.Div(
    [
        html.Div(
            dcc.Link(
                f"{page['name']} - {page['path']}", href=page["relative_path"]
            )
        )
        for page in dash.page_registry.values()
    ]
))

# Entry point for gunicorn when running in production.
server = app.server

if __name__ == '__main__':
    app.run_server(debug=True)
