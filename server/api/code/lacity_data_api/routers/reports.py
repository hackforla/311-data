import datetime

from fastapi import APIRouter

from ..models.service_request import ServiceRequest

router = APIRouter()


@router.get("/", description="*BETA: Rudimentary reporting endpoint")
async def run_report(
    start_date: datetime.date = datetime.date.today() - datetime.timedelta(days=7),
    end_date: datetime.date = datetime.date.today()
):

    result = await ServiceRequest.get_request_reports(
        start_date,
        end_date
    )
    return result
