from json import dumps, loads
import requests_async as requests


class FeedbackService(object):
    def __init__(self, config=None):
        self.config = config
        self.token = None if not self.config  \
            else self.config['Github']['GITHUB_TOKEN']
        self.issues_url = None if not self.config \
            else self.config['Github']['ISSUES_URL']
        self.project_url = None if not self.config \
            else self.config['Github']['PROJECT_URL']
        
    async def create_issue(self, title, body, labels=['feedback'], milestone=None, assignees=[]):
        """
        Creates a Github issue via Github API v3 and returns the new issue id.

        Note: Per Github, the API (and required 'Accept' headers) may change without notice. 
        See https://developer.github.com/v3/issues/
        """
        headers = {
            "Authorization": "token {}".format(self.token),
            "Accept": "application/vnd.github.v3+json"
        }
        data = {
            'title': title,
            'body': body,
            'labels': labels,
            'milestone': milestone,
            'assigness': assignees
        }
        payload = dumps(data)

        async with requests.Session() as session:
            response = await session.post(self.issues_url, data=payload, headers=headers)
            response_content = loads(response.content)
            issue_id = response_content['id']
            return issue_id


    async def add_issue_to_project(self, issue_id, content_type='Issue'):
        """
        Takes a Github issue id and adds the issue to a project board card.
        Returns the response from Github API.

        Note: Per Github, the API (and required 'Accept' headers) may change without notice. 
        See https://developer.github.com/v3/projects/cards/
        """
        headers = {
            "Authorization": "token {}".format(self.token),
            "Accept": "application/vnd.github.inertia-preview+json"
        }
        data = {
            'content_id': issue_id,
            'content_type': content_type
        }
        payload = dumps(data)

        async with requests.Session() as session:
            response = await session.post(self.project_url, data=payload, headers=headers)
            return response
