from fastapi import APIRouter

from ..models.api_models import RequestTypeList
from ..models.request_type import RequestType

router = APIRouter()


@router.get("", response_model=RequestTypeList)
async def get_all_request_types():
    return await RequestType.query.gino.all()


@router.get("/{id}")
async def get_request_type(id: int):
    result = await RequestType.get_or_404(id)
    return result.to_dict()
