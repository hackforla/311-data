import os
from .query import query as query_pb
from .populate import populate as populate_pb
from .data_access import clear_data, set_ready, check_ready


class PickleBase(object):
    def __init__(self):
        self.enabled = int(os.environ.get('PICKLEBASE', 0)) == 1
        self.ready = False

    def available(self):
        if not self.enabled:
            return False
        if self.ready:
            return True
        self.ready = check_ready()
        return self.ready

    def populate(self):
        try:
            clear_data()
            populate_pb()
            set_ready()
            print('PICKLEBASE IS READY')
        except Exception as e:
            self.enabled = False
            print('FAILED TO POPULATE PICKLEBASE')
            print(e)

    def query(self, table, fields, filters):
        return query_pb(table, fields, filters)


pb = PickleBase()
