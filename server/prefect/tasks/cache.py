import requests

import prefect
from prefect.utilities.tasks import task

CACHE_PATH = "/status/reset-cache"


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
