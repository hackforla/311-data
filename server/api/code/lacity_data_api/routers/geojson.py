import json

from fastapi import APIRouter, HTTPException

from ..models.geometry import Geometry

router = APIRouter()


def createFeature(row):
    item = dict(row)
    return {
        "type": "Feature",
        "properties": {
            "council_id": item['council_id'],
            "council_name": item['council_name'],
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


@router.get("/geocode")
async def get_enclosing_council(
    latitude: float,
    longitude: float,
):
    result = await Geometry.get_enclosing_council(latitude, longitude)
    if not result:
        raise HTTPException(status_code=404, detail="Item not found")
    return result
