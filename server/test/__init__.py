import sys
from os.path import dirname, abspath, join


# add src directory to path so pytest can find modules
src_dir = join(dirname(abspath(__file__)), '..', 'src')
sys.path.append(src_dir)
