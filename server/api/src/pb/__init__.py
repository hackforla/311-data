from .query import query as query_pb
from .populate import populate as populate_pb
from .data_access import clear_data, set_ready, check_ready
from settings import Picklebase
from utils.log import log, log_heading


enabled = Picklebase.ENABLED
ready = False
populating = False


def available():
    global ready

    if not enabled:
        return False

    if ready:
        return True
    else:
        ready = check_ready()
        return ready


def populate():
    global enabled, populating

    if populating:
        return

    populating = True

    try:
        log_heading('populating picklebase', spacing=(1, 0))
        clear_data()
        populate_pb()
        set_ready()
        log('\nPicklebase ready.')
    except Exception as e:
        enabled = False
        log('FAILED TO POPULATE PICKLEBASE')
        log(e)

    populating = False


def query(table, fields, filters):
    return query_pb(table, fields, filters)
