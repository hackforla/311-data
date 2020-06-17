from . import versions


def latest_version():
    vers = [int(name[2:]) for name in dir(versions) if name.startswith('v_')]
    return sorted(vers)[-1]


def migrate(old=0, new=2):
    for version in range(old + 1, new + 1):
        getattr(versions, f'v_{version}').migrate()
