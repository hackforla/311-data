from typing import List

from fastapi import APIRouter
from pydantic import BaseModel

from ..models.request_type import RequestType
from ..models import db

router = APIRouter()


class RequestTypeModel(BaseModel):
    type_id: int
    type_name: str

    class Config:
        orm_mode = True


Items = List[RequestTypeModel]


@router.get("/", response_model=Items)
async def get_all_request_types():
    return await db.all(RequestType.query)


@router.get("/{id}")
async def get_request_type(id: int):
    request_type = await RequestType.get_or_404(id)
    return request_type.to_dict()
