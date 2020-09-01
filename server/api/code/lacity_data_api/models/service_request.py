from . import db


class ServiceRequest(db.Model):
    __tablename__ = 'service_requests'

    request_id = db.Column(db.Integer, primary_key=True)
    created_date = db.Column(db.Date)
    closed_date = db.Column(db.Date)
    type_id = db.Column(db.SmallInteger)
    council_id = db.Column(db.SmallInteger)
    address = db.Column(db.String)
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
