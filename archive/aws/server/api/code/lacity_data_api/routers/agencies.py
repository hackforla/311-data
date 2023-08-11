from fastapi import APIRouter

from ..models import api_models as schemas
from ..models.agency import Agency

router = APIRouter()


@router.get("", response_model=schemas.AgencyList)
async def get_all_agencies():
    result = await Agency.query.gino.all()
    return result


@router.get("/{id}")
async def get_agency(id: int):
    result = await Agency.get_or_404(id)
    return result.to_dict()
