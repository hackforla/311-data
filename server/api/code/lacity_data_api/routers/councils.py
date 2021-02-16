from fastapi import APIRouter, HTTPException

from ..models import api_models as schemas
from ..models.council import Council, get_open_request_counts

router = APIRouter()


@router.get("", response_model=schemas.CouncilList)
async def get_all_councils():
    result = await Council.all()
    return result


@router.get("/{id}", response_model=schemas.Council)
async def get_council(id: int):
    result = await Council.one(id)
    if not result:
        raise HTTPException(status_code=404, detail="Item not found")
    return result


@router.get("/{id}/counts/open/types", response_model=schemas.TypeCountList)
async def get_council_open_requests(id: int):
    result = await get_open_request_counts(id)
    return result
