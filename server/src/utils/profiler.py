import logging
from functools import wraps
from contextlib import contextmanager
import cProfile
import io
import pstats
from sqlalchemy import event
from sqlalchemy.engine import Engine


# set up file logger
logger = logging.getLogger('311.profiler')
logger.setLevel(logging.DEBUG)
handler = logging.FileHandler('./static/profiler.log', 'w')
logger.addHandler(handler)


# log sql queries
event.listen(
    Engine,
    'before_cursor_execute',
    lambda conn, cursor, statement, parameters, context, executemany:
        logger.info(statement))


@contextmanager
def profiled():
    """
    Log detailed stats on code execution time.

    Usage:

        with profiled():
            # do things
    """
    # clear the log
    with open('./static/profiler.log', 'w'):
        pass

    pr = cProfile.Profile()
    pr.enable()
    yield
    pr.disable()
    s = io.StringIO()
    ps = pstats.Stats(pr, stream=s).sort_stats('cumulative')
    ps.print_stats()
    # ps.print_callers()
    # ps.print_callees()
    logger.info(s.getvalue())


def profiler():
    """
    Log detailed stats on code execution time for a function.

    Usage:

        @profiler()
        def my_func():
            # do things
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            with profiled():
                return f(*args, **kwargs)
        return decorated_function
    return decorator
