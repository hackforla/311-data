from datetime import datetime
from multiprocessing import cpu_count
import utils.resource as resource
from settings import Version, Github
import db


async def api():
    currentTime = datetime.utcnow().replace(microsecond=0)
    semVersion = '{}.{}.{}'.format(Version.MAJOR, Version.MINOR, Version.PATCH)

    return {
        'currentTime': f'{currentTime.isoformat()}Z',
        'gitSha': Github.SHA,
        'version': semVersion,
        'lastPulled': f'{db.info.last_updated().isoformat()}Z'}


async def system():
    return {
        'cpuCount': cpu_count(),
        'pageSize': resource.page_size(),
        'limits': resource.limits(),
        'usage': resource.usage()}


async def database():
    return {
        'tables': db.info.tables(),
        'rows': db.info.rows()}
