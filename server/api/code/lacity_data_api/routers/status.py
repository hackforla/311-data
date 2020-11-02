import datetime

from fastapi import APIRouter

from ..models.schemas import StatusTypes
from ..services import status, utilities
from ..config import GITHUB_CODE_VERSION, GITHUB_SHA, DEBUG

router = APIRouter()


@router.post("/reset-cache", include_in_schema=True if DEBUG else False)
async def reset_cache():
    if await status.reset_cache():
        prime_result = await utilities.build_cache()
        return {
            "message": "cache successfully reset",
            "details": prime_result
        }
    else:
        return {
            "message": "cache not reset"
        }


@router.get("/{status_type}",
            description="Provides the status of backend systems")
async def check_status_type(status_type: StatusTypes):
    if status_type == StatusTypes.api:
        return {
            'currentTime': datetime.datetime.now(),
            'gitSha': GITHUB_SHA,
            'version': GITHUB_CODE_VERSION,
            'lastPulled': await status.get_last_updated()
        }

    if status_type == StatusTypes.database:
        return {
            "postgres_version": await status.get_db_version(),
            "alembic_version": await status.get_alembic_version(),
            "last_updated": await status.get_last_updated(),
            "request_types": await status.get_request_types_count(),
            "regions": await status.get_regions_count(),
            "councils": await status.get_councils_count(),
            "service_requests": await status.get_service_requests_count(),
            "requests": await status.get_requests_count()
        }

    if status_type == StatusTypes.cache:
        await utilities.build_cache()

        return {
            "keys": await status.get_cache_keys(),
            "info": await status.get_cache_info()
        }

    if status_type == StatusTypes.log:
        result = await status.get_recent_log()
        return result
