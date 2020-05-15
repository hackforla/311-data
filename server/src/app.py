import os
from sanic import Sanic
from sanic.response import json
from sanic_cors import CORS
from sanic_gzip import Compress
from configparser import ConfigParser
from threading import Timer
from datetime import datetime
from multiprocessing import cpu_count

from services.pinClusterService import PinClusterService
from services.heatmapService import HeatmapService
from services.requestDetailService import RequestDetailService
from services.visualizationsService import VisualizationsService
from services.comparisonService import ComparisonService
from services.sqlIngest import DataHandler
from services.feedbackService import FeedbackService
from services.dataService import DataService

from utils.sanic import add_performance_header
from utils.redis import cache
from utils.database import db

app = Sanic(__name__)
CORS(app)
compress = Compress()


def environment_overrides():
    settings = app.config['Settings']
    for section in settings:
        for key in settings[section]:
            envKey = key.upper()
            if os.environ.get(envKey, None):
                settings[section][envKey] = os.environ.get(envKey)


def configure_app():
    # Settings initialization
    config = ConfigParser()
    settings_file = os.path.join(os.getcwd(), 'settings.cfg')
    config.read(settings_file)
    app.config['Settings'] = config
    environment_overrides()
    app.config["STATIC_DIR"] = os.path.join(os.getcwd(), "static")
    os.makedirs(os.path.join(app.config["STATIC_DIR"], "temp"), exist_ok=True)
    if app.config['Settings']['Server']['Debug']:
        add_performance_header(app)
    cache.config(app.config['Settings']['Redis'])
    db.config(app.config['Settings']['Database'])


@app.route('/apistatus')
@compress.compress()
async def healthcheck(request):
    currentTime = datetime.utcnow()
    settings = app.config['Settings']
    githubSha = settings['Github']['GITHUB_SHA']
    semVersion = '{}.{}.{}'.format(
        settings['Version']['VER_MAJOR'],
        settings['Version']['VER_MINOR'],
        settings['Version']['VER_PATCH'])

    data_worker = DataService()
    lastPulled = await data_worker.lastPulled()

    return json({'currentTime': currentTime,
                 'gitSha': githubSha,
                 'version': semVersion,
                 'lastPulled': lastPulled})


@app.route('/')
@compress.compress()
async def index(request):
    return json('You hit the index')


@app.route('/ingest', methods=["GET"])
@compress.compress()
async def ingest(request):
    """
    Query parameters:
        years:
            a comma-separated list of years to import.
            Ex. '/ingest?years=2015,2016,2017'
        limit:
            the max number of records per year
        querySize:
            the number of records per request to socrata

    Counts:
        These are the counts you can expect if you do the full ingest:

        2015: 237305
        2016: 952486
        2017: 1131558
        2018: 1210075
        2019: 1308093
        2020: 319628 (and counting)

        GET https://data.lacity.org/resource/{ID}.json?$select=count(srnumber)

    Hint:
        Run /ingest without params to get all socrata data
    """

    # parse params
    defaults = app.config['Settings']['Ingestion']

    years = request.args.get('years', defaults['YEARS'])
    limit = request.args.get('limit', defaults['LIMIT'])
    querySize = request.args.get('querySize', defaults['QUERY_SIZE'])

    # validate params
    current_year = datetime.now().year
    allowed_years = [year for year in range(2015, current_year+1)]
    years = set([int(year) for year in years.split(',')])
    if not all(year in allowed_years for year in years):
        return json({
            'error': f"'years' param values must be one of {allowed_years}"
        })

    limit = int(limit)
    querySize = int(querySize)
    querySize = min([limit, querySize])

    # get data
    loader = DataHandler(app.config['Settings'])
    data = await loader.populateDatabase(years=years,
                                         limit=limit,
                                         querySize=querySize)
    return json(data)


@app.route('/pin-clusters', methods=["POST"])
@compress.compress()
async def pinClusters(request):
    worker = PinClusterService(app.config['Settings'])

    postArgs = request.json
    filters = {
        'startDate': postArgs.get('startDate', None),
        'endDate': postArgs.get('endDate', None),
        'requestTypes': postArgs.get('requestTypes', []),
        'ncList': postArgs.get('ncList', [])
    }
    zoom = int(postArgs.get('zoom', 0))
    bounds = postArgs.get('bounds', {})
    options = postArgs.get('options', {})

    clusters = await worker.get_pin_clusters(filters, zoom, bounds, options)
    return json(clusters)


@app.route('/heatmap', methods=["POST"])
@compress.compress()
async def heatmap(request):
    worker = HeatmapService(app.config['Settings'])

    postArgs = request.json
    filters = {
        'startDate': postArgs.get('startDate', None),
        'endDate': postArgs.get('endDate', None),
        'requestTypes': postArgs.get('requestTypes', []),
        'ncList': postArgs.get('ncList', [])
    }

    heatmap = await worker.get_heatmap(filters)
    return json(heatmap)


@app.route('/servicerequest/<srnumber>', methods=["GET"])
async def requestDetails(request, srnumber):
    detail_worker = RequestDetailService(app.config['Settings'])

    return_data = await detail_worker.get_request_detail(srnumber)
    return json(return_data)


@app.route('/visualizations', methods=["POST"])
@compress.compress()
async def visualizations(request):
    worker = VisualizationsService()

    postArgs = request.json
    start = postArgs.get('startDate', None)
    end = postArgs.get('endDate', None)
    ncs = postArgs.get('ncList', [])
    requests = postArgs.get('requestTypes', [])

    data = await worker.visualizations(startDate=start,
                                       endDate=end,
                                       requestTypes=requests,
                                       ncList=ncs)
    return json(data)


@app.route('/comparison/<type>', methods=["POST"])
@compress.compress()
async def comparison(request, type):
    worker = ComparisonService()

    postArgs = request.json
    startDate = postArgs.get('startDate', None)
    endDate = postArgs.get('endDate', None)
    requestTypes = postArgs.get('requestTypes', [])
    set1 = postArgs.get('set1', None)
    set2 = postArgs.get('set2', None)

    data = await worker.comparison(type=type,
                                   startDate=startDate,
                                   endDate=endDate,
                                   requestTypes=requestTypes,
                                   set1=set1,
                                   set2=set2)
    return json(data)


@app.route('/feedback', methods=["POST"])
@compress.compress()
async def handle_feedback(request):
    github_worker = FeedbackService(app.config['Settings'])
    postArgs = request.json
    title = postArgs.get('title', None)
    body = postArgs.get('body', None)

    issue_id = await github_worker.create_issue(title, body)
    response = await github_worker.add_issue_to_project(issue_id)
    return json(response)


@app.route('/test_multiple_workers')
@compress.compress()
async def test_multiple_workers(request):
    Timer(10.0, print, ["Timer Test."]).start()
    return json("Done")


if __name__ == '__main__':
    configure_app()
    worker_count = max(cpu_count()//2, 1)
    app.run(host=app.config['Settings']['Server']['HOST'],
            port=int(app.config['Settings']['Server']['PORT']),
            workers=worker_count,
            debug=app.config['Settings']['Server']['DEBUG'])
