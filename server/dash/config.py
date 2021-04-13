from os import environ


API_HOST = environ.get('API_HOST') or 'https://dev-api.311-data.org'
PRELOAD = environ.get('PRELOAD', 'False').lower() in ['true', '1']
DASH_FILES = environ.get('DASH_FILES') or 'dashboards'
