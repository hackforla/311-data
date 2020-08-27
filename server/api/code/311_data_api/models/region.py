from . import db


class Region(db.Model):
    __tablename__ = 'regions'

    region_id = db.Column(db.SmallInteger, primary_key=True)
    region_name = db.Column(db.String)
