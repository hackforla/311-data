# Install 311 Server locally for development

This doc in intended for client side developers working on the 311 Data project who want an easy way to run a local copy of the server. It downloads images for whatever code is in the ```dev``` branch in GitHub.

## Introduction and Prerequisites

These instructions assume only that Docker is installed. They also assume the steps are being followed on a Mac, but it should be easy enough to follow for other platforms.

All of the 311 Server components (e.g. Postgres, Redis) are downloaded and run as Docker containers. This wouldn't be the best configuration for a production system, but it is more than adequate for development.

The 4 included images will need about 1 GB of space with an additional 1 GB or so needed for the data.

## Installation Instructions

The easiest way to install the 311 Data Server is with the included initialization script. You will also need to provide environment variables which can be done by copying the sample file.

To install, open a terminal to the client/docker directory and execute the following commands.

```bash
cp api.env .env         # copy the sample API environment file to .env
chmod +x init_api.sh    # make the init bash script executable
./init_api.sh           # execute the script
```

The process should take about 5 minutes to run from start to finish.

## Updating Data

In order to have current data for reports the prefect container should be run periodically. It will get any data added or changed since the last time it was run.

```bash
docker-compose run prefect python flow.py        # loads new data to database
```

## Updating Code

When there are changes to the code in the /server/api folder on the dev branch, new images are automatically created and uploaded to Docker Hub. In order to get these images run the following commands from the client/docker directory.

```bash
docker-compose pull       # downloads any new images
docker-compose up         # starts any stopped images
```

## Stopping Running Containers

When you don't need the images during development you can stop them (but not remove them) with the ```down``` command.

```bash
docker-compose down
```

## Removing Containers and Images

Once you are done working on the project altogether you can remove the Docker images and recover disk space. To completely delete the images and associated volumes run the ```rm``` command.

```bash
docker-compose rm
```
