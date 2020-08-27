from typing import List

from fastapi import APIRouter
from pydantic import BaseModel

from ..models.region import Region
from ..models import db

router = APIRouter()


class RegionModel(BaseModel):
    region_id: int
    region_name: str

    class Config:
        orm_mode = True


Items = List[RegionModel]


@router.get("/", response_model=Items)
async def index():
    return await db.all(Region.query)


@router.get("/{rid}")
async def get_region(rid: int):
    region = await Region.get_or_404(rid)
    return region.to_dict()
