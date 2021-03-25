import re
from aiocache import cached
from sqlalchemy import text, cast, DATE
from ..models import db
from ..models.service_request import ServiceRequest
from ..models.request_type import RequestType
from ..models.council import Council
from ..models.source import Source
from ..models.agency import Agency
from .utilities import cache_key


# maps keywords to sqlalchemy columns or functions
field_dict = {
    "created_year": db.extract(
        'YEAR',
        ServiceRequest.created_date
    ).label('created_year'),
    "created_month": db.extract(
        'MONTH',
        ServiceRequest.created_date
    ).label('created_month'),
    "created_dow": db.extract(
        'DOW',
        ServiceRequest.created_date
    ).label('created_dow'),
    "created_hour": db.extract(
        'HOUR',
        ServiceRequest.created_date
    ).label('created_hour'),
    "created_date": cast(
        ServiceRequest.created_date, DATE
    ).label('created_date'),
    "council_name": Council.council_name,
    "agency_name": Agency.agency_name,
    "source_name": Source.source_name,
    "type_name": RequestType.type_name
}

filter_regex = "^(\w+)([>=<]+)([\w-]+)$"  # noqa


@cached(key_builder=cache_key, alias="default")
async def run_report(field, filter):

    # set up the fields for select and group by
    fields = [field_dict[i] for i in field]
    group_by = fields.copy()
    fields.append(db.func.count().label("counts"))
    # TODO: good idea, but need to figure out best way to present open vs. closed requests  # noqa
    # fields.append(db.func.sum(
    #     (cast(ServiceRequest.closed_date, DATE) - cast(ServiceRequest.created_date, DATE))  # noqa
    # ).label("total_days"))
    # fields.append(db.func.count(
    #     ServiceRequest.closed_date
    # ).label("total_closed"))

    # set up filters for where clause
    filters = []
    for f in filter:
        match = re.search(filter_regex, f)
        filters.append(f"{match.group(1)} {match.group(2)} '{match.group(3)}'")

    result = await (
        db.select(
            fields
        ).select_from(
            ServiceRequest.join(RequestType).join(Council).join(Source)
            .join(Agency, ServiceRequest.agency_id == Agency.agency_id)
        ).where(
            text(' AND '.join(filters))
        ).group_by(
            *group_by
        ).gino.all()
    )

    return result
