import json
import requests


class GithubService(object):
    def __init__(self, config=None):
        self.config = config
        self.username = None if not self.config  \
            else self.config['Authentication']['USERNAME']
        self.password = None if not self.config  \
            else self.config['Authentication']['PASSWORD']
        pass

    def create_issue(self, title, body=None, assignee=None,
                     milestone=None, labels=None):
        '''Create an issue on github.com using the given parameters.'''
        # Our url to create issues via POST
        url = 'https://api.github.com/repos/rgao/python_course/issues'
        # Create an authenticated session to create the issue
        s = requests.Session()
        s.auth = requests.auth.HTTPDigestAuth(self.username, self.password)
        # Create our issue
        issue = {'title': title,
                 'body': body,
                 'assignee': assignee,
                 'labels': labels}

        r = s.post(url, json.dumps(issue))
        if r.status_code == 201:
            print('Successfully created Issue "%s"') % title
        else:
            print('Could not create Issue')
            print('Response:', r.content)
