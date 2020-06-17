import requests_async as requests
from json import dumps
from settings import Slack


SLACK_URL = Slack.WEBHOOK_URL


async def send(text):
    if SLACK_URL is None or not text:
        return None

    async with requests.Session() as session:
        await session.post(
            SLACK_URL,
            data=dumps({'text': text}),
            headers={'Content-type': 'application/json'})
