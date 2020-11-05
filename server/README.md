# 311 Data Server

[![Build and Test Action Status](https://github.com/hackforla/311-data/workflows/Build%20and%20Test/badge.svg)](https://github.com/hackforla/311-data/actions)

- [How to set up a local API server](docs/server_setup.md)
- [How to contribute](docs/contributing.md)
- [Useful commands](docs/useful_commands.md)

## Server Tech Stack

- [Python 3.7](https://www.python.org/downloads/release/python-379/) (Debian 10.x)
- [Postgres 12](https://www.postgresql.org/docs/12/index.html) (Debian 10.x)
- [Redis 6](https://redis.io/) (Debian 10.x)
- [FastAPI](https://fastapi.tiangolo.com/) async API with Starlette/uvicorn/ASGI/Pydantic
- [Gino](https://python-gino.org/) async ORM with asyncpg/SQLAlchemy/Alembic
- [Aiocache](https://aiocache.readthedocs.io/) async cache with Redis support

The API is intended to be modern, simple, performant, secure, open-source and well-supported. The tech stack focuses on Python tools with good asynchronous support. As asynchronous libraries are still immature these dependencies may need to be updated in the near future.

## Data Loading

Data comes from the LA 311 system by way of the Socrata app.

https://data.lacity.org/A-Well-Run-City/Neighborhood-Councils-Certified-/fu65-dz2f

## Testing

- pytest
- postman

To get code coverage reports run ```pytest --cov=code```
