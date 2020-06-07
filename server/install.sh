cp .env.example .env
docker-compose up --no-start
docker-compose run api python bin/db_reset.py
docker-compose up
