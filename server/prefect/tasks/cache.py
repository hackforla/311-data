import requests

import prefect
from prefect.utilities.tasks import task

CACHE_PATH = "/status/reset-cache"
RELOAD_PATH = "/reload"


@task
def clear_cache():
    """
    clears the server cache once new data is done loading
    """
    logger = prefect.context.get("logger")
    api_url = prefect.config.api_url
    reset_path = f"{api_url}{CACHE_PATH}"
    response = requests.post(reset_path)

    if response.status_code == 200:
        logger.info(f"Cache clearing successful: {reset_path}")
    else:
        logger.info("Cache clearing failed")


@task
def reload_reports():
    """
    clears the server cache once new data is done loading
    """
    logger = prefect.context.get("logger")
    report_server_url = prefect.config.report_server_url
    reload_path = f"{report_server_url}{RELOAD_PATH}"
    response = requests.get(reload_path)

    if response.status_code == 200:
        logger.info(f"Report reloading successful: {reload_path}")
    else:
        logger.info("Report reloading failed")
