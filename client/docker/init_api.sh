#!/bin/bash
cp api.env .env
docker-compose up -d  # downloads and starts all images (in background)
docker-compose run api alembic upgrade head  # install the database schema
docker-compose run prefect python flow.py  # loads data to database
open http://localhost:5000/docs  # open the docs page (on a Mac)
