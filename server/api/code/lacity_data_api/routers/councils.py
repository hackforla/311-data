from fastapi import APIRouter

from ..models.schemas import CouncilList
from ..models.council import Council, get_open_request_counts

router = APIRouter()


@router.get("/", response_model=CouncilList)
async def get_all_councils():
    result = await Council.query.gino.all()
    return result


@router.get("/{id}")
async def get_council(id: int):
    result = await Council.get_or_404(id)
    return result.to_dict()


# TODO: add test
@router.get("/{id}/counts/open/types")
async def get_council_open_requests(id: int):
    result = await get_open_request_counts(id)
    return result
    # return dict((row.type_name, row.type_count) for row in result)
