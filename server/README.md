# 311 Data Server

[![Build and Test Action Status](https://github.com/hackforla/311-data/workflows/Build%20and%20Test/badge.svg)](https://github.com/hackforla/311-data/actions)

- [How to set up a local API server](docs/server_setup.md)
- [How to contribute](docs/contributing.md)
- [Nightly data loading](prefect/README.md)
- [Infrastructure](aws/README.md)
- [Useful commands](docs/useful_commands.md)

## Server Tech Stack

- [FastAPI](https://fastapi.tiangolo.com/) and [Starlette](https://www.starlette.io/): tools to provide a fast, asynchronous stack for building RESTful APIs in Python
- [Gino](https://python-gino.org/) and [SQL Alchemy](https://www.sqlalchemy.org/): tools for accessing and modifying the database
- [Postgres](https://www.postgresql.org/docs/12/index.html): the persistent SQL database
- [Redis](https://redis.io/) with [Aiocache](https://aiocache.readthedocs.io/) and [Aioredis](https://aioredis.readthedocs.io/en/v1.3.0/): to provide high-performance caching
- [Prefect](https://www.prefect.io/core): for the nightly data ingestion pipeline

Everything runs on Python 3.7 and the Debian 10 "Buster" Linux distribution where applicable.

The API is intended to be modern, simple, performant, secure, open-source and well-supported. The tech stack focuses on Python tools with good asynchronous support. As asynchronous libraries are still somewhat immature these dependencies may need to be updated in the future.

## Data Loading

Data comes from the LA 311 system by way of the Socrata app.
https://data.lacity.com
https://data.lacity.org/A-Well-Run-City/Neighborhood-Councils-Certified-/fu65-dz2f

## Testing

- pytest
- postman

To get code coverage reports run ```pytest --cov=code```
