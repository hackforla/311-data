# 311 Data Server

[![API Build and Test Action Status](https://github.com/hackforla/311-data/workflows/Build%20and%20Test/badge.svg)](https://github.com/hackforla/311-data/actions)

## Server Tech Stack

The 311 Data Server is comprised of several different components deployed in containers to the public cloud. The API is intended to be modern, asynchronous, simple, performant, secure, open-source and well-supported.

The server code is set up as a monorepo with directories and containers corresponding to the following functions:

- RESTful Python API (/api)
  - [FastAPI](https://fastapi.tiangolo.com/) and [Starlette](https://www.starlette.io/): tools to provide a fast, asynchronous stack for building RESTful APIs in Python
  - [Gino](https://python-gino.org/) and [SQL Alchemy](https://www.sqlalchemy.org/): tools for accessing and modifying the database
  - [Postgres](https://www.postgresql.org/docs/12/index.html): the persistent SQL database
  - [Redis](https://redis.io/) with [Aiocache](https://aiocache.readthedocs.io/) and [Aioredis](https://aioredis.readthedocs.io/en/v1.3.0/): to provide high-performance caching
- Report Server (/dash)
  - [Plotly Dash](https://dash.plotly.com/): for interactive, responsive reports
  - [Pandas](https://pandas.pydata.org/): for pulling, aggregating, and calculating data in reports
- Data loading pipeline (/prefect)
  - [Prefect](https://www.prefect.io/core): for the nightly data ingestion tasks and cache clearing and priming

The last 2 projects are:

- [Terraform](https://www.terraform.io/): for managing the AWS infrastructure
- [Locust](https://locust.io/): for load-testing the API

Everything runs on Python 3.7 and the Debian 10 "Buster" Linux distribution where applicable.

## Data Loading

Data comes from the LA 311 system by way of the Socrata app using a Prefect workflow that is run nightly. Prefect is deployed in its own container and is run as a nightly Scheduled Task.

For more information about the data loading process look at the [Prefect README](prefect/README.md).

## Testing

Unit and integration testing is done locally and as a CI process run using GitHub Actions.

There are several testing tools used in the project:

- pytest: unit and integration tests
- locust: load tests

We currently have 90+% coverage on the API. To get code coverage reports run ```pytest --cov=code```

## Deployment

### Code Deployment

Containers are deployed on merge to Docker Hub and new tasks are created in ECS. The result is a zero-downtime deployment. When a new version requires a database change a separate task must be created to run upgrades using Alembic.

### Infrastructure Deployment

The infrastructure is deployed to AWS using Terraform. API containers are hosted in ECS with data served from an RDS instance. For more information about the infrastrucure deployment process look at the [Terraform README](terraform/README.md).

## More Information

- [Local API server setup](../docs/server_setup.md)
- [Infrastructure with Terraform](terraform/README.md)
- [Nightly data loading](prefect/README.md)
- [Data loading and fields](../docs/data_loading.md)
- [Releases and upgrades](../upgrades.md)
