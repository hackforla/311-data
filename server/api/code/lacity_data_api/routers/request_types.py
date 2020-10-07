from fastapi import APIRouter

from ..models.schemas import RequestTypeList
from ..models.request_type import RequestType
from ..models import db

router = APIRouter()


@router.get("/", response_model=RequestTypeList)
async def get_all_request_types():
    return await db.all(RequestType.query)


@router.get("/{id}")
async def get_request_type(id: int):
    result = await RequestType.get_or_404(id)
    return result.to_dict()
