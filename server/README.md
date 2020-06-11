## Getting Started

### TL;DR
  - install docker and docker compose on your machine
  - run `chmod +x install.sh && ./install.sh` from this directory
  - put a [Socrata](https://dev.socrata.com/) api token in your `.env` file
  - run `docker-compose run api python bin/db_seed.py --years 2019,2020`

### Step 1: install docker and docker-compose
Docker and Docker-Compose are the only required dependencies for running the server. You can find installation instructions [here](https://docs.docker.com/compose/install/) for Docker and [here](https://docs.docker.com/compose/install/) for Docker-Compose.

Once you're done, you can check that everything is working:
```
docker --version              # confirms docker is installed
docker-compose --version      # confirms docker-compose is installed
docker info                   # confirms the docker daemon is running
```

### Step 2: run the install script
With docker running on your machine, `cd` into this directory and run:
```
chmod +x install.sh && ./install.sh
```
This will download/build a bunch of docker images, create your `.env` file, set up your database, and then fire everything up. If all goes well, at the end you should have running api server backed by Postgres and Redis. You can then tour the running services by hitting these URLs in a browser:
- http://localhost:5000 -- the api -- should say "you hit the index". This means the api is running.
- http://localhost:8080 -- a postgres GUI. Login with the following:
  - System: **PostgreSQL**
  - Server: **db**
  - Username: **311_user**
  - Password: **311_pass**
  - Database: **311_db**
- http://localhost:5001 -- a redis GUI. Login with the following:
  - Host: **redis**
  - Port: **6379**
  - Database ID: **0**

You can shut down all the services by hitting `Ctrl-C`. And run `docker-compose up` to bring everything back up again.

### Step 3: seed your database
Right now the server is functional and all endpoints should be working. But for most purposes you'll need some data in your database. The data comes from [Socrata](https://dev.socrata.com/), a public api that hosts many datasets for LA and other cities. To add data, you'll need to get a Socrata token and run one more command.

- #### 3a: add a Socrata token to your .env file (possible optional)
Socrata threatens to throttle you if you don't have an api token. We're not sure they actually do that, but the api does seem to run more slowly without a token. So get a token from another team member, or [register](https://opendata.socrata.com/login) with Socrata and they'll give you one. Then add it to the Socrata section in your `.env` file:
```
SOCRATA_TOKEN=thetoken
```
- #### 3b: run the seed script
It takes a while to seed the database, so we recommend starting with 2 years of data from Socrata. Run the following command to get data for 2019 and 2020, which is plenty for most dev purposes. ETA **20 to 30 minutes**. (If you've still got the backend services running, you can run this command in a separate terminal window.)
```
docker-compose run api python bin/db_seed.py --years 2019,2020
```
If you decide later that you need more data, just run the command again with the year(s) you want to add. Socrata goes back to 2015.

(NOTE: run the above command with `--help` instead of `--years` for more info on the options. And if you ever want to reset your database and start over, run `docker-compose run api python bin/db_reset.py`.)


## Development

### Optional Dependencies

  - #### Postman


### Useful commands
```
docker-compose up                     # start the backend services
docker-compose up --build             # start the backend services after rebuilding containers

docker-compose run api bash           # log in to api shell
docker-compose run api flake8         # lint your python code
docker-compose run api pytest         # run unit tests against python code

docker-compose run redis redis-cli    # run the redis cli  
```

### Using the python interpreter
```
docker-compose run api bash
cd src
python

Python 3.7.7 (default, May 20 2020, 21:10:21)
[GCC 8.3.0] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> import db
>>> db.version()                      # print version
>>> db.info.years()                   # list years currently in db
>>> db.info.rows()                    # row counts for years in db
>>> db.requests.add_years([2018])     # add 2018 to DB
>>> db.requests.drop_years([2018])    # drop 2018
>>> db.reset()                        # wipe the DB and recreate tables/views
```

### Dev workflow



## Uninstall
Run this command to remove all docker containers, images, volumes, and networks that are specific to this project. It will leave in place generic docker assets (like the `postgres` and `python` images) that you may be using for other purposes.
```
docker-compose down --rmi local --volumes
```
