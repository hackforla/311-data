from fastapi import APIRouter

from ..models import api_models as schemas
from ..models.source import Source

router = APIRouter()


@router.get("", response_model=schemas.SourceList)
async def get_all_sources():
    result = await Source.query.gino.all()
    return result


@router.get("/{id}")
async def get_source(id: int):
    result = await Source.get_or_404(id)
    return result.to_dict()
