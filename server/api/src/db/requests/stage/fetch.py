import math
from . import table
from utils.log import log
from .socrata import SocrataClient


def fetch_year(year, num_rows, batch_size, since=None):
    log('\nYear: {}'.format(year))

    if num_rows == -1:
        num_rows = math.inf
    client = SocrataClient()
    where = None if since is None else f"updateddate > '{since.isoformat()}'"
    offset = 0

    while offset < num_rows:
        limit = min(batch_size, num_rows - offset)
        log('\tFetching {} rows with offset {}'.format(limit, offset))
        rows = client.get(
            year=year,
            limit=limit,
            offset=offset,
            where=where)

        log(f'\tInserting {len(rows)} rows')
        table.insert(rows)
        offset += len(rows)

        if len(rows) < batch_size:
            break

    log('\tTotal rows inserted: {}'.format(offset))
