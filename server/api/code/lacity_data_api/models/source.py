from . import db


class Source(db.Model):
    __tablename__ = 'sources'

    source_id = db.Column(db.SmallInteger, primary_key=True)
    source_name = db.Column(db.String)
