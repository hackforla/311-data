import json

import pendulum
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


def createHotspotFeature(row):
    item = dict(row)
    return {
        "type": "Feature",
        "properties": {
            "hotspot_id": item['hotspot_id'],
            "count": item['hotspot_count'],
        },
        "geometry": {
            "type": "Point",
            "coordinates": [
                item['hotspot_long'],
                item['hotspot_lat']
            ]
        }
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


@router.get("/hotspots")
async def get_hotspots(
    type_id: int = 6,  # defaults to illegal dumping
    start_date: str = pendulum.today().subtract(years=1).to_date_string()
):

    features = []
    result = await Geometry.get_hotspots(type_id, start_date)

    for i in result:
        features.append(createHotspotFeature(i))

    return {
        "type": "FeatureCollection",
        "features": features
    }
