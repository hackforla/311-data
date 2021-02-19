from . import db
from geoalchemy2 import Geometry


class Geometry(db.Model):
    __tablename__ = "geometries"

    nc_id = db.Column(db.SmallInteger, primary_key=True)
    geometry = db.Column(Geometry(geometry_type="MULTIPOLYGON"))

    @classmethod
    async def get_council_geojson(cls):

        result = await (
            db.select(
                [
                    Geometry.nc_id,
                    db.func.ST_AsGeoJSON(Geometry.geometry).label("geometry")
                ]
            ).gino.all()
        )
        return result

    @classmethod
    async def get_enclosing_council(cls, latitude: float, longitude: float):

        result = await (
            db.select(
                [
                    Geometry.nc_id.label("council_id"),
                ]
            ).where(
                db.func.ST_WITHIN(
                    db.func.ST_MakePoint(longitude, latitude), Geometry.geometry
                )
            ).gino.first()
        )
        return result
