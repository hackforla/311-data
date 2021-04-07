import os
from typing import List, Optional

import pendulum
from fastapi import APIRouter, Query, BackgroundTasks
from fastapi.responses import FileResponse

from lacity_data_api.services.reports import run_report, make_year_csv, make_csv
from lacity_data_api.config import DATA_DIR

router = APIRouter()

filter_regex = "^(\w+)([>=<]+)([\w-]+)$"  # noqa
dt = pendulum.today()


# TODO: add end of previous month filter.
# might be a problem with multiple default filters.
@router.get("")
async def get_report(
    field: Optional[List[str]] = Query(
        ["type_name", "created_date"],
        description="ex. created_date",
        regex="""(created_year|created_month|created_dow|created_hour|created_date|council_name|type_name|agency_name|source_name)"""  # noqa
    ),
    filter: Optional[List[str]] = Query(
        [
            f"created_date>={ dt.subtract(months=1).start_of('month').format('YYYY-MM-DD') }"  # noqa
        ],
        description="""
            Field then operator then value
            (ex. created_date>=2021-01-01 or council_name=Arleta
            """,
        regex=filter_regex
    )
):
    results = await run_report(field, filter)
    return results


# TODO: Need to rethink. These don't work in production with our tiny CPUs.
# Gunicorn kills the worker when it sees a CPU/Memory spike.
@router.get("/export/service_requests.csv", description="EXPERIMENTAL")
async def get_csv(background_tasks: BackgroundTasks):
    csv_file = f"{DATA_DIR}/service_requests.csv"
    if os.path.exists(csv_file):
        return FileResponse(csv_file)
    else:
        background_tasks.add_task(make_csv)
        return "Started file generation"


@router.get("/export/service_requests.csv.gz", description="EXPERIMENTAL")
async def get_gzip(background_tasks: BackgroundTasks):
    gzip_file = f"{DATA_DIR}/service_requests.csv.gz"
    if os.path.exists(gzip_file):
        return FileResponse(gzip_file)
    else:
        background_tasks.add_task(make_csv)
        return "Started file generation"


@router.get("/export/{year}/{file}.csv", description="EXPERIMENTAL")
async def get_year_csv(
    background_tasks: BackgroundTasks,
    file: str = "service_requests",
    year: int = 2020,
):
    csv_file = f"{DATA_DIR}/{file}-{year}.csv"
    if os.path.exists(csv_file):
        return FileResponse(csv_file)
    else:
        background_tasks.add_task(make_year_csv, file, year)
        return "Started file generation"


@router.get("/export/{year}/{file}.csv.gz", description="EXPERIMENTAL")
async def get_year_gzip(
    background_tasks: BackgroundTasks,
    file: str = "service_requests",
    year: int = 2020,
):
    gzip_file = f"{DATA_DIR}/{file}-{year}.csv.gz"
    if os.path.exists(gzip_file):
        return FileResponse(gzip_file)
    else:
        background_tasks.add_task(make_year_csv, file, year)
        return "Started file generation"
