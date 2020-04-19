import time
from contextlib import contextmanager
from functools import wraps


@contextmanager
def timed(name=None):
    """
    Print execution time for a piece of code.

    Usage:

        with timed('mycode'):
            # do things
    """
    start = time.perf_counter()
    yield
    duration = time.perf_counter() - start
    if name is not None:
        print('{}: {}'.format(name, duration), flush=True)
    else:
        print(duration, flush=True)


def timer(name=None):
    """
    Print execution time for a function.

    Usage:

        @timer('mytimer')
        def my_func():
                # do things
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            with timed(name):
                return f(*args, **kwargs)
        return decorated_function
    return decorator
