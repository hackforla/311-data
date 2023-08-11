# Locust Performance Testing

The project is set up to use Locust for performance testing. Having a python-based tool should make programmatic testing easier, but for now there is just a single test to replicate a user first visiting the site as most of the data gets cached in the React client on initial load.

## Running the Locust tests

Tests are set up to be run locally from the shell using the headless config. To run, set up a virtual environment for the locust directory and run pip install (or pipenv install or sync).

Once the locust dependency is installed you can just run the locust command from this directory and it will pick up setting from the locust.conf and run the test in locustfile.py.

```bash
locust
```

## Run the Locust test with Docker

Alternatively you can run this as a docker image.

```bash
docker run -p 8089:8089 -v $PWD:/mnt/locust locustio/locust -f /mnt/locust/locustfile.py
```
