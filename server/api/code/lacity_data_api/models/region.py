from . import db


class Region(db.Model):
    __tablename__ = 'regions'

    region_id = db.Column(db.SmallInteger, primary_key=True)
    region_name = db.Column(db.String)
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)


async def get_regions_dict():
    result = await db.all(Region.query)
    regions_dict = [
        (i.region_id, (i.region_name, i.latitude, i.longitude))
        for i in result
    ]
    return dict(regions_dict)
