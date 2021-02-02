import json

from fastapi import APIRouter

from ..models.geometry import Geometry

router = APIRouter()


def createFeature(row):
    item = dict(row)
    return {
        "type": "Feature",
        "properties": {
            "nc_id": item['nc_id']
        },
        "geometry": json.loads(item['geometry'])
    }


@router.get("")
async def get_all_geometries():
    result = await Geometry.get_council_geojson()

    features = []
    for i in result:
        features.append(createFeature(i))

    return {
        "type": "FeatureCollection",
        "features": features
    }
