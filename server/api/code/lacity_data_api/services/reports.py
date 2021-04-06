import csv
import gzip
import shutil
import re
from aiocache import cached
from sqlalchemy import text, cast, DATE
from ..config import DATA_DIR
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


async def make_csv_cache(table: str, year: int = 2020) -> None:

    columns = [
        "request_id",
        "srnumber",
        "created_date",
        "closed_date",
        "type_id",
        "agency_id",
        "source_id",
        "council_id",
        "region_id",
        "address",
        "latitude",
        "longitude",
        "city_id"
    ]

    query = db.text(f"""
        select * from {table} WHERE date_part('year', created_date) = {year};
    """)

    result = await db.all(query)

    with open(f"{DATA_DIR}/{table}-{year}.csv", 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(columns)
        writer.writerows(result)

    with open(f"{DATA_DIR}/{table}-{year}.csv", 'rb') as f_in:
        with gzip.open(f"{DATA_DIR}/{table}-{year}.csv.gz", 'wb') as f_out:
            shutil.copyfileobj(f_in, f_out)
