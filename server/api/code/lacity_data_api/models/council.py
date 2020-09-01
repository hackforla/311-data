from . import db


class Council(db.Model):
    __tablename__ = "councils"

    council_id = db.Column(db.SmallInteger, primary_key=True)
    council_name = db.Column(db.String)
    region_id = db.Column(db.SmallInteger)
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
