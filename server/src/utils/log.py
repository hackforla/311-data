from config import config


def log(*args):
    if config['Server']['DEBUG']:
        print(*args, flush=True)
