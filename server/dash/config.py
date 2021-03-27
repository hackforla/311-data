from os import environ


API_HOST = environ.get('API_HOST') or 'https://dev-api.311-data.org'
PRELOAD = bool(environ.get('PRELOAD'))
DASH_FILES = environ.get('DASH_FILES') or 'dashboards'
