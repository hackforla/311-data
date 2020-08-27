from typing import List
import datetime

from fastapi import APIRouter
from pydantic import BaseModel

from ..models.service_request import ServiceRequest
from ..models import db

router = APIRouter()


class ServiceRequestModel(BaseModel):
    request_id: int
    council_id: int
    type_id: int
    created_date: datetime.date
    closed_date: datetime.date
    address: str
    latitude: float
    longitude: float

    class Config:
        orm_mode = True


Items = List[ServiceRequestModel]


@router.get("/", response_model=Items)
async def index(skip: int = 0, limit: int = 100):
    async with db.transaction():
        cursor = await ServiceRequest.query.gino.iterate()
        if skip > 0:
            await cursor.forward(skip)  # skip 80 rows
        result = await cursor.many(limit)  # and retrieve next 10 rows

    return result


@router.get("/{srid}")
async def get_service_request(srid: int):
    svcreq = await ServiceRequest.get_or_404(srid)
    return svcreq.to_dict()
