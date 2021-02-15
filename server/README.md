# 311 Data Server

[![Build and Test Action Status](https://github.com/hackforla/311-data/workflows/Build%20and%20Test/badge.svg)](https://github.com/hackforla/311-data/actions)

## Server Tech Stack

The 311 Data Server is comprised of several different components deployed in containers to the cloud using Terraform.

- [FastAPI](https://fastapi.tiangolo.com/) and [Starlette](https://www.starlette.io/): tools to provide a fast, asynchronous stack for building RESTful APIs in Python
- [Gino](https://python-gino.org/) and [SQL Alchemy](https://www.sqlalchemy.org/): tools for accessing and modifying the database
- [Postgres](https://www.postgresql.org/docs/12/index.html): the persistent SQL database
- [Redis](https://redis.io/) with [Aiocache](https://aiocache.readthedocs.io/) and [Aioredis](https://aioredis.readthedocs.io/en/v1.3.0/): to provide high-performance caching
- [Prefect](https://www.prefect.io/core): for the nightly data ingestion pipeline

Everything runs on Python 3.7 and the Debian 10 "Buster" Linux distribution where applicable.

The API is intended to be modern, simple, performant, secure, open-source and well-supported. The tech stack focuses on Python tools with good asynchronous support. As asynchronous libraries are still somewhat immature these dependencies may need to be updated in the future.

## Data Loading

Data comes from the LA 311 system by way of the Socrata app using a Prefect workflow that is run nightly. Prefect is deployed in its own container and is run as a nightly Scheduled Task.

For more information about the data loading process look at the [Prefect README](prefect/README.md).

## Testing

Testing is done locally and as a CI process run using GitHub Actions.

There are several testing tools used in the project:

- pytest: unit and integration tests
- postman: REST API integration tests
- locust: load tests

We currently have 90+% coverage on the API. To get code coverage reports run ```pytest --cov=code```

## Deployment

The API is deployed to AWS using Terraform. API containers are hosted in ECS with data served from an RDS instance.

For more information about the deployment process look at the [Terraform README](terraform/README.md).

## More Information

- [How to set up a local API server](../docs/server_setup.md)
- [Infrastructure](terraform/README.md)
- [Nightly data loading](prefect/README.md)
- [Data fields](../docs/data_fields.md)
- [Server Setup](../server_setup.md)
- [Upgrades](../upgrades.md)
- [Useful commands](../docs/useful_commands.md)
