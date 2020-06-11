from json import dumps, loads
import requests_async as requests
from settings import Github


TOKEN = Github.TOKEN
ISSUES_URL = Github.ISSUES_URL
PROJECT_URL = Github.PROJECT_URL


async def create_issue(title,
                       body,
                       labels=['feedback'],
                       milestone=None,
                       assignees=[]):
    """
    Creates a Github issue via Github API v3 and returns the new issue id.

    Note: Per Github, the API (and required 'Accept' headers) may change
    without notice.
    See https://developer.github.com/v3/issues/
    """
    headers = {
        "Authorization": "token {}".format(TOKEN),
        "Accept": "application/vnd.github.v3+json"}

    data = {
        'title': title,
        'body': body,
        'labels': labels,
        'milestone': milestone,
        'assignees': assignees}

    payload = dumps(data)

    async with requests.Session() as session:
        try:
            response = await session.post(ISSUES_URL,
                                          data=payload,
                                          headers=headers)
            response.raise_for_status()
            response_content = loads(response.content)
            issue_id = response_content['id']
            return issue_id
        except requests.exceptions.HTTPError as errh:
            return errh
        except requests.exceptions.ConnectionError as errc:
            return errc
        except requests.exceptions.Timeout as errt:
            return errt
        except requests.exceptions.RequestException as err:
            return err


async def add_issue_to_project(issue_id, content_type='Issue'):
    """
    Takes a Github issue id and adds the issue to a project board card.
    Returns the response from Github API.

    Note: Per Github, the API (and required 'Accept' headers) may change
    without notice.
    See https://developer.github.com/v3/projects/cards/
    """
    headers = {
        "Authorization": "token {}".format(TOKEN),
        "Accept": "application/vnd.github.inertia-preview+json"}

    data = {
        'content_id': issue_id,
        'content_type': content_type}

    payload = dumps(data)

    async with requests.Session() as session:
        try:
            response = await session.post(PROJECT_URL,
                                          data=payload,
                                          headers=headers)
            response.raise_for_status()
            return response.status_code
        except requests.exceptions.HTTPError as errh:
            return errh
        except requests.exceptions.ConnectionError as errc:
            return errc
        except requests.exceptions.Timeout as errt:
            return errt
        except requests.exceptions.RequestException as err:
            return err
