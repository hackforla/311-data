from datetime import datetime, timedelta
import csv
import os
import requests

from sodapy import Socrata
import prefect
from prefect.utilities.tasks import task


DATE_SPEC = "%Y-%m-%d"

"""
This task will call Socrata and output the returned data in CSV format.

This uses the Sodapy Python client library to call the Socrata API:
    https://github.com/xmunoz/sodapy

More information about how to use SoQL (the Socrata query language) is here:
    https://dev.socrata.com/docs/queries/

"""


@task(max_retries=3, retry_delay=timedelta(seconds=10))
def download_dataset(
        dataset,
        start_datetime: datetime = None,
        end_datetime: datetime = None,
        max_rows: int = 2000000,
        batch_size: int = 100000,
        output_dir: str = "output"
):

    # config for run
    logger = prefect.context.get("logger")
    fieldnames = list(prefect.config.data.fields.keys())
    offset = 0

    where = None if start_datetime is None else f"updateddate > '{start_datetime.isoformat()}'"
    if end_datetime:
        where += f" and updateddate < '{end_datetime.isoformat()}'"

    output_file = os.path.join(
        output_dir, f"{dataset}-start-{start_datetime.strftime(DATE_SPEC)}-end-{end_datetime.strftime(DATE_SPEC)}.csv")

    # create Socrata client
    client = Socrata(
        prefect.config.socrata.host,
        prefect.config.socrata.token
    )

    # start downloading Socrata dataset in batches
    logger.info(f"Downloading dataset: {dataset}")

    while offset < max_rows:
        limit = min(batch_size, max_rows - offset)
        logger.info(f'Fetching {limit} rows with offset {offset}')

        try:
            rows = client.get(
                dataset,
                select=",".join(fieldnames),
                limit=limit,
                offset=offset,
                where=where
            )
            if len(rows) > 0:
                if offset == 0:
                    # prepare output CSV during the first batch pull
                    os.makedirs(os.path.dirname(output_file), exist_ok=True)

                    with open(output_file, "w") as fd:
                        writer = csv.DictWriter(fd, fieldnames)
                        writer.writeheader()

                # append batch to CSV file
                with open(output_file, "a") as fd:
                    writer = csv.DictWriter(fd, fieldnames)
                    writer.writerows(rows)

                logger.info(f'Added {len(rows)} rows to file')

                offset += len(rows)

            if len(rows) < batch_size:
                break

        except requests.exceptions.ReadTimeout:
            logger.warn('Read timeout occurred during fetch. Continuing...')

    # wrap up
    logger.info(f'{offset:,} total rows downloaded for dataset: {dataset}')

    # return the output file name for the next task
    return os.path.basename(output_file)
