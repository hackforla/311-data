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
async def get_all_regions():
    result = await db.all(Region.query)
    return result


@router.get("/{id}")
async def get_region(id: int):
    result = await Region.get_or_404(id)
    return result.to_dict()
