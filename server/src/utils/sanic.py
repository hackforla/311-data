import time
import json


def add_performance_header(sanic_app):
    """
    Add a header to sanic responses that contains the number of
    seconds it took to execute the request.
    """
    async def request(req):
        req.ctx.start = time.perf_counter()

    async def response(req, res):
        try:
            duration = time.perf_counter() - req.ctx.start
            res.headers['x-performance'] = json.dumps({
                'executionTime': round(duration, 4)
            })
        except Exception:
            pass

    sanic_app.register_middleware(request, attach_to='request')
    sanic_app.register_middleware(response, attach_to='response')
