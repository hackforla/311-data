from . import db


class Region(db.Model):
    __tablename__ = 'regions'

    region_id = db.Column(db.SmallInteger, primary_key=True)
    region_name = db.Column(db.String)
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
