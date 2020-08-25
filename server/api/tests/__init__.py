import os
import sys
from os.path import join, dirname
from dotenv import load_dotenv


sys.path.append(join(dirname(__file__), '../src'))

print(os.environ)
load_dotenv("test.env")
