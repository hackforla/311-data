# 311 API

## Tech Stack

* [Python 3.7](https://www.python.org/downloads/release/python-379/) (Debian 10.x)
* [Postgres 12](https://www.postgresql.org/docs/12/index.html) (Debian 10.x)
* [FastAPI](https://fastapi.tiangolo.com/) with Starlette/uvicorn/ASGI/Pydantic
* [Gino](https://python-gino.org/) with asyncpg/SQLAlchemy/Alembic
* [Pytest](https://docs.pytest.org/)
* [Docker](https://www.docker.com/)
* [GitHub](https://github.com/)

The API is intended to be modern, simple, performant, secure, open-source and well-supported. The tech stack focuses on Python tools with good asynchronous support. As asynchronous libraries are still immature these dependencies may need to be updated in the near future.

## Running using Docker Compose

Setting for Docker Compose are in the .env file in the /server directory.

To start the DB and API from the /server directory simply run

```bash
docker-compose up
```

This will spin up an API and database container. To try it out:

* Ensure Test API is running with welcome message at http://localhost:5000/
* Test API using Open API (Swagger) at http://localhost:5000/docs
* Run the ReactJS app ```npm start``` from /client to make sure front-end works

## Data Loading

Data comes from the LA 311 system by way of the Socrata app.

https://data.lacity.org/A-Well-Run-City/Neighborhood-Councils-Certified-/fu65-dz2f

## Testing

* pytest
* postman
* cypress

## Code coverage

To get code coverage reports run ```pytest --cov=code```

The 'code' directory has the new version and is all that needs testing. Coverage currently sits at 77%.

## TODOs

* add async caching
* add more tests (e.g. negative cases)
* finish routes
* evaluate data loading alternatives
* add coverage reporting to CI and --cov-fail-under to guarantee
* add static code analysis tools and security/CVE checking
* add telemetry:
OpenTelemetry instrumentors exist for FastAPI, asyncpg, SQLAlchemy
https://opentelemetry-python.readthedocs.io/
https://opentelemetry.lightstep.com/

## Odd and Ends

To time API calls using curl: add ```--write-out '%{time_total}\n' --output /dev/null --silent```

For example:

```bash
curl -X POST "http://localhost:5000/map/pins" -H  "accept: application/json" -H  "Content-Type: application/json" -d "{\"startDate\":\"01/01/2020\",\"endDate\":\"08/27/2020\",\"ncList\":[52,46,128,54,104,76,97,121,55],\"requestTypes\":[\"Homeless Encampment\"]}" --write-out '%{time_total}\n' --output /dev/null --silent
```

Here's how to go about killing any process orphaned by VS Code using port 5000

```bash
lsof -ti tcp:5000 | xargs kill
```
