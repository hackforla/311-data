import os
import sys
from os.path import join, dirname
from settings import Server


sys.path.append(join(dirname(__file__), '../src'))

if Server.DEBUG:
    print(os.environ)
