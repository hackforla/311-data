from sanic import Sanic
from sanic_cors import CORS
from sanic_compress import Compress
from multiprocessing import cpu_count
import control.route_handlers as R
from control.error_handler import ErrorHandler
from control.headers import add_performance_header
from utils.log import log_heading
from settings import Server


app = Sanic(__name__)

routes = {
    '/': (
        ['GET'], R.index),

    '/status/api': (
        ['GET', 'HEAD'], R.status.api),

    '/status/sys': (
        ['GET'], R.status.sys),

    '/status/db': (
        ['GET'], R.status.db),

    '/servicerequest/<srnumber>': (
        ['GET'], R.request_detail),

    '/map/clusters': (
        ['POST'], R.map.clusters),

    '/map/heat': (
        ['POST'], R.map.heat),

    '/map/pins': (
        ['POST'], R.map.pins),

    '/visualizations': (
        ['POST'], R.visualizations),

    '/comparison/frequency': (
        ['POST'], R.comparison.frequency),

    '/comparison/timetoclose': (
        ['POST'], R.comparison.timetoclose),

    '/comparison/counts': (
        ['POST'], R.comparison.counts),

    '/open-requests': (
        ['POST'], R.open_requests),

    '/feedback': (
        ['POST'], R.feedback)}


def start():
    CORS(app)
    Compress(app)

    for route, (methods, handler) in routes.items():
        # need to have OPTIONS on all routes for CORS
        app.add_route(handler, route, methods + ['OPTIONS'])

    app.error_handler = ErrorHandler()

    @app.listener('after_server_stop')
    async def on_restart(app, loop):
        log_heading('restarting server')

    # fixes error raised when compressing OPTIONS response
    def fix_compression(req, res):
        if req.method == 'OPTIONS':
            res.content_type = ''
    app.register_middleware(fix_compression, attach_to='response')

    if Server.DEBUG:
        add_performance_header(app)

    workers = Server.WORKERS
    if workers == -1:
        workers = max(cpu_count() // 2, 1)

    app.run(
        port=Server.PORT,
        host=Server.HOST,
        debug=Server.DEBUG,
        access_log=Server.ACCESS_LOG,
        auto_reload=Server.AUTO_RELOAD,
        workers=workers)
