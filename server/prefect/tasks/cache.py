import asyncio
import requests
import os

from pyppeteer import launch
import prefect
from prefect.utilities.tasks import task

CACHE_PATH = "/status/reset-cache"
RELOAD_PATH = "/reload"
SUCCESS_STRING = "Reloading..."


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


async def run_js_page(url: str):

    if os.environ.get('IS_DOCKER', False):
        browser = await launch(
            executablePath='/usr/bin/google-chrome-stable',
            userDataDir='/app',
            headless=True,
            handleSIGINT=False,
            handleSIGTERM=False,
            handleSIGHUP=False,
            args=[
                '--no-sandbox',
            ]
        )
    else:
        browser = await launch(
            headless=True,
            handleSIGINT=False,
            handleSIGTERM=False,
            handleSIGHUP=False,
        )

    page = await browser.newPage()
    await page.goto(url)
    await page.waitForSelector('#reloading-msg')
    content = await page.content()
    await browser.close()
    return content


@task
def reload_reports():
    """
    clears the server cache once new data is done loading
    """
    logger = prefect.context.get("logger")
    report_server_url = prefect.config.report_server_url
    reload_path = f"{report_server_url}{RELOAD_PATH}"

    result = asyncio.run(run_js_page(reload_path))

    # TODO: REMOVE THIS
    logger.info(result)

    if SUCCESS_STRING in result:
        logger.info(f"Report reloading successful: {reload_path}")
    else:
        logger.warning("Report reloading FAILED")
