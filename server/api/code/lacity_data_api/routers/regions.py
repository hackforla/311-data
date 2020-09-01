from typing import List

from fastapi import APIRouter
from pydantic import BaseModel

from ..models.region import Region
from ..models import db

router = APIRouter()


class RegionModel(BaseModel):
    region_id: int
    region_name: str
    latitude: float
    longitude: float

    class Config:
        orm_mode = True


Items = List[RegionModel]


@router.get("/", response_model=Items)
async def index():
    result = await db.all(Region.query)
    return result


@router.get("/{rid}")
async def get_region(rid: int):
    result = await Region.get_or_404(rid)
    return result.to_dict()
