import os
import sys
from os.path import join, dirname


sys.path.append(join(dirname(__file__), '../src'))

try:
    from settings import Server
    if Server.DEBUG:
        print(os.environ)
except ImportError:
    pass
