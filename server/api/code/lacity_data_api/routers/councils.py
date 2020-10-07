from fastapi import APIRouter

from ..models.schemas import CouncilList
from ..models.council import Council, get_open_request_counts
from ..models import db

router = APIRouter()


@router.get("/", response_model=CouncilList)
async def get_all_councils():
    result = await db.all(Council.query)
    return result


@router.get("/{id}")
async def get_council(id: int):
    result = await Council.get_or_404(id)
    return result.to_dict()


@router.get("/{id}/open-requests")
async def get_council_open_requests(id: int):
    result = await get_open_request_counts(id)
    return dict((row.type_name, row.type_count) for row in result)
