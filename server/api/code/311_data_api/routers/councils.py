from typing import List

from fastapi import APIRouter
from pydantic import BaseModel

from ..models.council import Council
from ..models import db

router = APIRouter()


class CouncilModel(BaseModel):
    council_id: int
    council_name: str

    class Config:
        orm_mode = True


Items = List[CouncilModel]


@router.get("/", response_model=Items)
async def index():
    return await db.all(Council.query)


@router.get("/{cid}")
async def get_council(cid: int):
    council = await Council.get_or_404(cid)
    return council.to_dict()
