from sanic.response import json
from .parse_args import to
from services import (
    requests as requests_svc,
    visualizations as vis_svc,
    comparison as comp_svc,
    github as github_svc,
    map as map_svc,
    status as status_svc,
    email as email_svc)


async def index(request):
    return json('You hit the index')


class status:
    async def api(request):
        data = await status_svc.api()
        return json(data)

    async def sys(request):
        data = await status_svc.system()
        return json(data)

    async def db(request):
        data = await status_svc.database()
        return json(data)


async def request_detail(request, srnumber):
    data = requests_svc.item_query(srnumber)
    return json(data)


class map:
    async def clusters(request):
        data = await map_svc.clusters(**to.parse(request.json, {
            'startDate': to.req.DATE,
            'endDate': to.req.DATE,
            'requestTypes': to.opt.LIST_OF_STR,
            'ncList': to.opt.LIST_OF_INT,
            'zoom': to.opt.INT,
            'bounds': to.opt.DICT_OF_FLOAT,
            'options': to.opt.DICT_OF_INT}))

        return json(data)

    async def heat(request):
        data = await map_svc.heatmap(**to.parse(request.json, {
            'startDate': to.req.DATE,
            'endDate': to.req.DATE,
            'requestTypes': to.opt.LIST_OF_STR,
            'ncList': to.opt.LIST_OF_INT}))

        return json(data)


async def visualizations(request):
    data = await vis_svc.visualizations(**to.parse(request.json, {
        'startDate': to.req.DATE,
        'endDate': to.req.DATE,
        'requestTypes': to.opt.LIST_OF_STR,
        'ncList': to.opt.LIST_OF_INT}))

    return json(data)


class comparison:
    def args(request):
        return to.parse(request.json, {
            'startDate': to.req.DATE,
            'endDate': to.req.DATE,
            'requestTypes': to.opt.LIST_OF_STR,
            'set1': to.req.COMPARISON_SET,
            'set2': to.req.COMPARISON_SET})

    async def frequency(request):
        data = await comp_svc.freq_comparison(**comparison.args(request))
        return json(data)

    async def timetoclose(request):
        data = await comp_svc.ttc_comparison(**comparison.args(request))
        return json(data)

    async def counts(request):
        data = await comp_svc.counts_comparison(**comparison.args(request))
        return json(data)


async def feedback(request):
    args = to.parse(request.json, {
        'title': to.req.STR,
        'body': to.req.STR})

    id, number = await github_svc.create_issue(args['title'], args['body'])
    await github_svc.add_issue_to_project(id)
    await email_svc.respond_to_feedback(args['body'], number)

    return json({'success': True})
