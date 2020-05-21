import os
from .query import query as query_pb
from .populate import populate as populate_pb


class PickleBase(object):
    def __init__(self):
        self.enabled = False

    def populate(self):
        populate_pb()

    def query(self, table, fields, filters):
        return query_pb(table, fields, filters)


pb = PickleBase()


if int(os.environ.get('PICKLEBASE', 0)) == 1:
    print('PICKLEBASE ENABLED')
    try:
        pb.populate()
        pb.enabled = True
    except Exception as e:
        print('FAILED TO POPULATE PICKLEBASE')
        print(e)
