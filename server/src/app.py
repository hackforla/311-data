import os
from sanic import Sanic
from sanic.response import json
from services.time_to_close import time_to_close
from services.frequency import frequency
from services.ingress_service import ingress_service
from configparser import ConfigParser
from threading import Timer
from multiprocessing import cpu_count
from services.sqlIngest import *
from datetime import datetime


app = Sanic(__name__)


def configure_app():
    # Settings initialization
    config = ConfigParser()
    settings_file = os.path.join(os.getcwd(), 'settings.cfg')
    config.read(settings_file)
    app.config['Settings'] = config
    if os.environ.get('DB_CONNECTION_STRING', None):
        app.config['Settings']['Database']['DB_CONNECTION_STRING'] =\
            os.environ.get('DB_CONNECTION_STRING')
    app.config["STATIC_DIR"] = os.path.join(os.getcwd(), "static")
    os.makedirs(os.path.join(app.config["STATIC_DIR"], "temp"), exist_ok=True)


@app.route('/')
async def index(request):
    return json('You hit the index')


@app.route('/timetoclose')
async def timetoclose(request):
    ttc_worker = time_to_close(app.config['Settings'])

    # dates = loads(ttc_worker.ttc_view_dates())
    summary = ttc_worker.ttc_summary(allData=True,
                                     service=True,
                                     allRequests=False,
                                     requestType="'Bulky Items'",
                                     viewDates=True)

    return json(summary)


@app.route('/requestfrequency')
async def requestfrequency(request):
    freq_worker = frequency(app.config['Settings'])

    data = freq_worker.freq_view_data(service=True,
                                      councils=[],
                                      aggregate=True)

    return json(data)


@app.route('/sample-data')
async def sample_route(request):
    sample_dataset = {'cool_key': ['value1', 'value2'],
                      app.config['REDACTED']: app.config['REDACTED']}
    return json(sample_dataset)


@app.route('/ingest', methods=["POST"])
async def ingest(request):
    """Accept POST requests with a list of years to import.
        Query parameter name is 'years', and parameter value is 
        a comma-separated list of years to import.
        Ex. '/ingest?years=2015,2016,2017'
    """
    current_year = datetime.now().year
    ALLOWED_YEARS = [year for year in range(2015, current_year+1)]
    if not request.args.get("years"):
        raise Exception("'years' parameter is reqired.")
    years = set([int(year) for year in request.args.get("years").split(",")])
    if not all(year in ALLOWED_YEARS for year in years):
        raise Exception(f"'years' parameter values must be one of {ALLOWED_YEARS}")
    loader = DataHandler()
    loader.loadConfig(configFilePath='./settings.cfg')
    loader.populateFullDatabase(yearRange=years)
    return_data = {'response': 'ingest ok'}
    return json(return_data)


@app.route('/update')
async def update(request):
    ingress_worker = ingress_service()
    return_data = ingress_worker.update()
    return json(return_data)


@app.route('/delete')
async def delete(request):
    ingress_worker = ingress_service()
    return_data = ingress_worker.delete()
    return json(return_data)


@app.route('/test_multiple_workers')
async def test_multiple_workers(request):
    Timer(10.0, print, ["Timer Test."]).start()
    return json("Done")


if __name__ == '__main__':
    configure_app()
    app.run(host=app.config['Settings']['Server']['HOST'],
            port=int(app.config['Settings']['Server']['PORT']),
            workers=cpu_count()//2,
            debug=app.config['Settings']['Server']['DEBUG'])
