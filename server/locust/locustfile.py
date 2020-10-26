from locust import HttpUser, TaskSet, task, between
from locust.contrib.fasthttp import FastHttpUser


class WebsiteUser(HttpUser):
    """
    User class that does requests to the locust web server running on localhost,
    using the fast HTTP client
    """

    host = "http://dev-api.311-data.org"
    users = 20
    hatch_rate = 2
    wait_time = between(2, 5)

    # some other things you can configure on FastHttpUser
    # connection_timeout = 60.0
    # insecure = True
    # max_redirects = 5
    # max_retries = 1
    # network_timeout = 60.0

    @task
    def status_api(self):
        self.client.get("/status/api")

    @task
    def open_requests_shim(self):
        self.client.post("/open-requests")

    @task
    def open_requests(self):
        self.client.get("/requests/open")

    @task
    def open_requests_counts(self):
        self.client.get("/requests/open/counts/types")
