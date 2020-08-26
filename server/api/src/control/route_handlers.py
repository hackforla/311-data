import json
import datetime
from sanic import response
from .parse_args import to
from services import (
    requests as requests_svc,
    visualizations as vis_svc,
    comparison as comp_svc,
    github as github_svc,
    map as map_svc,
    status as status_svc,
    email as email_svc)


def default(obj):
    """Convert datetimes to epochs"""
    for item in obj:
        if isinstance(obj[item], (datetime.datetime, datetime.date, datetime.time)):
            obj[item] = int(obj[item].strftime('%s'))
    return json.dumps(obj)


async def index(request):
    return response.json('You hit the index')


class status:
    async def api(self, request):
        data = await status_svc.api()
        return response.json(data)

    async def sys(self, request):
        data = await status_svc.system()
        return response.json(data)

    async def db(self, request):
        data = await status_svc.database()
        return response.json(data)


async def request_detail(request, srnumber):
    data = requests_svc.item_query(srnumber)
    return response.json(data, dumps=default)


class map:
    async def clusters(self, request):
        data = await map_svc.pin_clusters(**to.parse(request.json, {
            'startDate': to.req.DATE,
            'endDate': to.req.DATE,
            'requestTypes': to.opt.LIST_OF_STR,
            'ncList': to.opt.LIST_OF_INT,
            'zoom': to.opt.INT,
            'bounds': to.opt.DICT_OF_FLOAT,
            'options': to.opt.DICT_OF_INT}))

        return response.json(data)

    async def heat(self, request):
        data = await map_svc.heatmap(**to.parse(request.json, {
            'startDate': to.req.DATE,
            'endDate': to.req.DATE,
            'requestTypes': to.opt.LIST_OF_STR,
            'ncList': to.opt.LIST_OF_INT}))

        # converting NumPy array to list before serializing
        return response.json(data.tolist())

    async def pins(self, request):
        data = await map_svc.pins(**to.parse(request.json, {
            'startDate': to.req.DATE,
            'endDate': to.req.DATE,
            'requestTypes': to.opt.LIST_OF_STR,
            'ncList': to.opt.LIST_OF_INT}))

        return response.json(data)


async def visualizations(request):
    data = await vis_svc.visualizations(**to.parse(request.json, {
        'startDate': to.req.DATE,
        'endDate': to.req.DATE,
        'requestTypes': to.opt.LIST_OF_STR,
        'ncList': to.opt.LIST_OF_INT}))

    return response.json(data)


class comparison:
    def args(self, request):
        return to.parse(request.json, {
            'startDate': to.req.DATE,
            'endDate': to.req.DATE,
            'requestTypes': to.opt.LIST_OF_STR,
            'set1': to.req.COMPARISON_SET,
            'set2': to.req.COMPARISON_SET})

    async def frequency(self, request):
        data = await comp_svc.freq_comparison(**comparison.args(request))
        return response.json(data)

    async def timetoclose(self, request):
        data = await comp_svc.ttc_comparison(**comparison.args(request))
        return response.json(data)

    async def counts(self, request):
        data = await comp_svc.counts_comparison(**comparison.args(request))
        return response.json(data)


async def open_requests(request):
    data = await requests_svc.open_requests()
    return response.json(data)


async def feedback(request):
    args = to.parse(request.json, {
        'title': to.req.STR,
        'body': to.req.STR})

    id, number = await github_svc.create_issue(args['title'], args['body'])
    await github_svc.add_issue_to_project(id)
    await email_svc.respond_to_feedback(args['body'], number)

    return response.json({'success': True})
