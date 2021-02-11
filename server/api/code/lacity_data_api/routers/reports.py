import datetime
import re
from typing import List, Optional

from fastapi import APIRouter, Query

from sqlalchemy import text
from ..models import db
from ..models.service_request import ServiceRequest
from ..models.request_type import RequestType
from ..models.council import Council

router = APIRouter()

# maps keywords to sqlalchemy columns or functions
field_dict = {
    "created_year": db.extract(
        'year',
        ServiceRequest.created_date
    ).label('created_year'),
    "created_month": db.extract(
        'month',
        ServiceRequest.created_date
    ).label('created_month'),
    "created_date": ServiceRequest.created_date,
    "council_name": Council.council_name,
    "type_name": RequestType.type_name
}

filter_regex = "^(\w+)([>=<]+)([\w-]+)$"  # noqa


# TODO: add created_dow option
@router.get("")
async def run_report(
    field: Optional[List[str]] = Query(
        ["type_name", "created_date"],
        description="ex. created_date",
        regex="(created_year|created_month|created_date|council_name|type_name)"
    ),
    filter: Optional[List[str]] = Query(
        [f"created_date>={str(datetime.date.today() - datetime.timedelta(days=7))}"],
        description="""
            Field then operator then value
            (ex. created_date>=2021-01-01 or council_name=Arleta
            """,
        regex=filter_regex
    )
):

    # set up the fields for select and group by
    fields = [field_dict[i] for i in field]
    group_by = fields.copy()
    fields.append(db.func.count().label("counts"))

    # set up filters for where clause
    filters = []
    for f in filter:
        match = re.search(filter_regex, f)
        filters.append(f"{match.group(1)} {match.group(2)} '{match.group(3)}'")

    result = await (
        db.select(
            fields
        ).select_from(
            ServiceRequest.join(RequestType).join(Council)
        ).where(
            text(' AND '.join(filters))
        ).group_by(
            *group_by
        ).gino.all()
    )

    return result
