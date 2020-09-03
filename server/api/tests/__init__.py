import os
import sys
from os.path import join, dirname

if os.getenv("DATABASE_URL") is None:
    os.environ["DATABASE_URL"] = "postgresql://311_user:311_pass@localhost:5433/311_db"

os.environ["PICKLEBASE_ENABLED"] = "False"
os.environ["PICKLECACHE_ENABLED"] = "False"
os.environ["TMP_DIR"] = "./__tmp__"

print(os.environ)

sys.path.append(join(dirname(__file__), '../src'))

try:
    from settings import Server
    if Server.DEBUG:
        print(os.environ)
except ImportError:
    pass
