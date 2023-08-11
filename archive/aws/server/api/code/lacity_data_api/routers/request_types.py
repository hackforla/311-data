from fastapi import APIRouter, HTTPException

from ..models import api_models as schemas
from ..models.request_type import RequestType

router = APIRouter()


@router.get("", response_model=schemas.RequestTypeList)
async def get_all_request_types():
    return await RequestType.all()


@router.get("/stats")
async def get_request_stats():
    result = await RequestType.get_type_stats()
    return result


@router.get("/{id}", response_model=schemas.RequestType)
async def get_request_type(id: int):
    result = await RequestType.one(id)
    if not result:
        raise HTTPException(status_code=404, detail="Item not found")
    return result
