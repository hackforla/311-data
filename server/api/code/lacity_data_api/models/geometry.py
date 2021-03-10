from geoalchemy2 import Geometry
from aiocache import cached

from . import db
from ..services import utilities


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

    @classmethod
    @cached(key_builder=utilities.classmethod_cache_key, alias="default")
    async def get_hotspots(cls, type_id: int, start_date: str):

        # using ~30m radius (epsilon) and 1+ request/month
        query = db.text(f"""
            SELECT
                h.hotspot_id,
                count(*) as hotspot_count,
                ST_X(ST_Centroid(ST_Collect(h.request_point))) as hotspot_long,
                ST_Y(ST_Centroid(ST_Collect(h.request_point))) as hotspot_lat
            FROM (
                SELECT
                    ST_SetSRID(
                        ST_MakePoint(longitude, latitude), 4326
                    ) as request_point,
                    ST_ClusterDBSCAN(
                        ST_SetSRID(ST_MakePoint(longitude, latitude), 4326),
                        eps := 0.0003, minpoints := 12
                    ) over () AS hotspot_id
                FROM
                    service_requests
                WHERE
                    created_date >= '{start_date}' AND type_id = {type_id}
            ) as h
            WHERE hotspot_id is not null
            GROUP BY h.hotspot_id
            ;
        """)

        result = await db.all(query)
        return result
