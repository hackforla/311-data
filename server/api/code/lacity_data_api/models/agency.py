from . import db


class Agency(db.Model):
    __tablename__ = 'agencies'

    agency_id = db.Column(db.SmallInteger, primary_key=True)
    agency_name = db.Column(db.String)
    website = db.Column(db.String)
    twitter = db.Column(db.String)
