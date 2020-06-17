import db
from .create_table import create_table
from .data_access import clear_stage, commit_pb
from settings import Picklebase


BATCH_SIZE = Picklebase.BATCH_SIZE


def create_map_table():
    def optimize(batch):
        batch['nc'] = batch['nc'].astype('Int64').astype('category')
        batch['requesttype'] = batch['requesttype'].astype('category')

    create_table(
        table='map',
        from_table='map',
        with_fields=[
            'createddate',
            'srnumber',
            'requesttype',
            'nc',
            'latitude',
            'longitude'
        ],
        engine=db.engine,
        batch_size=BATCH_SIZE,
        optimize=optimize)


def create_vis_table():
    def optimize(batch):
        batch['nc'] = batch['nc'].astype('Int64').astype('category')
        batch['cd'] = batch['cd'].astype('Int64').astype('category')
        batch['requesttype'] = batch['requesttype'].astype('category')
        batch['requestsource'] = batch['requestsource'].astype('category')

    create_table(
        table='vis',
        from_table='vis',
        with_fields=[
            'createddate',
            'requesttype',
            'requestsource',
            'nc',
            'cd',
            '_daystoclose'
        ],
        engine=db.engine,
        batch_size=BATCH_SIZE,
        optimize=optimize)


def populate():
    clear_stage()
    create_map_table()
    create_vis_table()
    commit_pb()
