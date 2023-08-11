from fastapi import APIRouter

from ..models.api_models import RegionList
from ..models.region import Region

router = APIRouter()


@router.get("", response_model=RegionList)
async def get_all_regions():
    result = await Region.all()
    return result


@router.get("/{id}")
async def get_region(id: int):
    result = await Region.get_or_404(id)
    return result.to_dict()
