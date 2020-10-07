from fastapi import APIRouter

from ..models.schemas import RegionList
from ..models.region import Region
from ..models import db

router = APIRouter()


@router.get("/", response_model=RegionList)
async def get_all_regions():
    result = await db.all(Region.query)
    return result


@router.get("/{id}")
async def get_region(id: int):
    result = await Region.get_or_404(id)
    return result.to_dict()
