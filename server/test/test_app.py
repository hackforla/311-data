import os
from configparser import ConfigParser

from src.app import app


def environment_overrides(module):
    if os.environ.get('DB_CONNECTION_STRING', None):
        module.app.config['Settings']['Database']['DB_CONNECTION_STRING'] =\
            os.environ.get('DB_CONNECTION_STRING')
    if os.environ.get('PORT', None):
        module.app.config['Settings']['Server']['PORT'] =\
            os.environ.get('PORT')


def configure_app(module):
    # Settings initialization
    config = ConfigParser()
    settings_file = os.path.join(os.getcwd(), 'test/test_settings.cfg')
    config.read(settings_file)
    module.app.config['Settings'] = config
    environment_overrides(module)
    module.app.config["STATIC_DIR"] = os.path.join(os.getcwd(), "static")
    os.makedirs(os.path.join(module.app.config["STATIC_DIR"], "temp"),
                exist_ok=True)


def setup_module(module):
    """ setup any state specific to the execution of the given module."""
    configure_app(module)


def teardown_module(module):
    """ teardown any state that was previously setup with a setup_module
    method.
    """
    pass


def test_index_returns_200():
    request, response = app.test_client.get('/')
    assert response.status == 200
    assert response.json == 'You hit the index'


def test_sample_data_returns_200():
    request, response = app.test_client.get('/sample-data')
    assert response.status == 200
    assert response.json == {'cool_key': ['value1', 'value2']}


def test_ingest_returns_200():
    request, response = app.test_client.post('/ingest?years=2019&querySize=1&limit=1')
    assert response.status == 200
    assert response.json == {'response': 'ingest ok'}
