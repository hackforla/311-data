import os
from sanic import Sanic
from sanic.response import json
from services.time_to_close import time_to_close
from services.frequency import frequency
from services.ingress_service import ingress_service
from configparser import ConfigParser


app = Sanic(__name__)

def configure_app():
    # Settings initialization
    config = ConfigParser()
    settings_file = os.path.join(os.getcwd(),'settings.cfg')
    config.read(settings_file)
    app.config['Settings'] = config


@app.route('/')
async def index(request):
    return json('You hit the index')


@app.route('/timetoclose')
async def timetoclose(request):
    ttc_worker = time_to_close()
    # Insert time to close calculation here
    return_data = ttc_worker.hello_world()

    return json(return_data)


@app.route('/requestfrequency')
async def requestfrequency(request):
    freq_worker = frequency()
    # Insert frequency calculation here
    return_data = freq_worker.hello_world()

    return json(return_data)


@app.route('/sample-data')
async def sample_route(request):
    sample_dataset = {'cool_key':['value1', 'value2'], app.config['REDACTED']:app.config['REDACTED']}
    return json(sample_dataset)


@app.route('/ingest')
async def ingest(request):
    ingress_worker = ingress_service(config=app.config['Settings'])
    return_data = ingress_worker.ingest()
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



if __name__ == '__main__':
    configure_app()
    app.run(host=app.config['Settings']['Server']['HOST'], port=app.config['Settings']['Server']['PORT'], debug=app.config['Settings']['Server']['DEBUG'])
