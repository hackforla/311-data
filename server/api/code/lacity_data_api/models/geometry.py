from geoalchemy2 import Geometry
from aiocache import cached

from . import db


class Geometry(db.Model):
    __tablename__ = "geometries"

    nc_id = db.Column(db.SmallInteger, primary_key=True)
    geometry = db.Column(Geometry(geometry_type="MULTIPOLYGON"))

    @classmethod
    @cached(key="Council.geojson", alias="default")
    async def get_council_geojson(cls):
        from lacity_data_api.models.council import Council  # noqa

        result = await (
            db.select(
                [
                    Council.council_id,
                    Council.council_name,
                    Geometry.nc_id,
                    db.func.ST_AsGeoJSON(Geometry.geometry).label("geometry")
                ]
            ).select_from(
                Geometry.join(Council, Geometry.nc_id == Council.data_code)
            ).gino.all()
        )
        return result

    @classmethod
    async def get_enclosing_council(cls, latitude: float, longitude: float):
        from lacity_data_api.models.council import Council  # noqa

        result = await (
            db.select(
                [
                    Council.council_id
                ]
            ).select_from(
                Geometry.join(Council, Geometry.nc_id == Council.data_code)
            ).where(
                db.func.ST_WITHIN(
                    db.func.ST_MakePoint(longitude, latitude), Geometry.geometry
                )
            ).gino.first()
        )
        return result
