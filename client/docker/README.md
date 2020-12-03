# Install 311 Server locally for development

This doc in intended for client side developers working on the 311 Data project who want an easy way to run a local copy of the server. It downloads images for whatever code is in the ```dev``` branch in GitHub.

## Introduction and Prerequisites

These instructions assume only that Docker is installed. They also assume the steps are being followed on a Mac, but it should be easy enough to follow for other platforms.

All of the 311 Server components (e.g. Postgres, Redis) are downloaded and run as Docker containers. This wouldn't be the best configuration for a production system, but it is more than adequate for development.

The 4 included images will need about 1 GB of space with an additional 1 GB or so needed for the data.

## Initialization Script

```bash
cp api.env .env                                 # copy the sample variables to .env
docker-compose up -d                            # downloads and starts all images
docker-compose run api alembic upgrade head     # install the database schema
docker-compose run prefect python flow.py       # loads data to database
open http://localhost:5000/docs                 # open the docs page (on a Mac)
```

## Installation Instructions

The easiest way to install the 311 Server is with the included initialization script. Open a terminal to the client/docker directory and execute the following commands.

```bash
chmod +x init_api.sh    # make the init bash script executable
./init_api.sh           # execute the script
```

The process should take about 5 minutes to run from start to finish.

## Updating the data

In order to have current data for reports the prefect container should be run periodically. It will get any data added or changed since the last time it was run.

```bash
docker-compose run prefect python flow.py        # loads new data to database
```
