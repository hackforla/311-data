from . import db


class Council(db.Model):
    __tablename__ = "councils"

    council_id = db.Column(db.SmallInteger, primary_key=True)
    council_name = db.Column(db.String)
    region_id = db.Column(db.SmallInteger)
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)


async def get_councils_dict():
    result = await db.all(Council.query)
    councils_dict = [
        (i.council_id, (i.council_name, i.latitude, i.longitude))
        for i in result
    ]
    return dict(councils_dict)
