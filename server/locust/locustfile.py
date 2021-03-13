from locust import task, between
from locust.contrib.fasthttp import FastHttpUser


class WebsiteUser(FastHttpUser):
    """
    User class that does requests to the locust web server running on localhost,
    using the fast HTTP client
    """

    wait_time = between(1.0, 5.0)

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
    def councils(self):
        self.client.get("/councils")

    @task
    def types(self):
        self.client.get("/types")

    @task
    def geojson(self):
        self.client.get("/geojson")

    @task
    def open_requests(self):
        self.client.get("/requests/pins/open")

    @task
    def open_requests_counts(self):
        self.client.get("/requests/counts/open/types")
