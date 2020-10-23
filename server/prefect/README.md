# Prefect Data loading POC

This proof-of-concept represents a new, standalone version of a data ingestion pipeline that load data downloaded from Socrata into the 311 Data project Postgres database.

The pipeline can be used either to initially populate a new database with one or more years of data or it can be used to get only new or changed records since the last time the tool was run.

The steps in the data ingestion/update process:

* Configure and start the flow
* Download data (by year) from Socrata and save it to CSV files
* Insert the downloaded data to a temporary table in Postgres
* Move the data from the temporary to the requests table
* Update views and vacuum the database
* Write some metadata about the load (and options post to Slack)

## To-dos/Next steps

* Clear API Redis cache when complete
* Clean out old CSV files (?)
* Create better mocks for tests
* Configure the views to refresh during load

## Socrata

The data comes from the Los Angeles 311 system as exposed though a [Socrata](https://dev.socrata.com/) instance [hosted by the city](https://data.lacity.com).

Socrata has a python library called [Sodapy](https://github.com/xmunoz/sodapy) which acts as a client for its API and is used in this project.

## Prefect

The engine managing the data ingestion process is [Prefect Core](https://www.prefect.io/core). [Prefect](https://www.prefect.io/) is a company built around an open source library in a so-called [open-core model](https://en.wikipedia.org/wiki/Open-core_model).

In the "Prefect" idiom, there are [tasks](https://docs.prefect.io/core/concepts/tasks.html) which perform an action and are chained together into a [flow](https://docs.prefect.io/core/concepts/flows.html). Flows can be executed in a number of different ways, but this project is set up to run the flow as a python file via the command line:

## Running Update with Docker

To load data into an API database using the Docker image

* Build the 'prefectpoc' docker image
* Run the docker image as follows:

```bash
# set the DSN as an environment variable
export PREFECT__CONTEXT__SECRETS__DSN=postgresql://{USER}:{PASSWORD}@{HOST}:{PORT}/{DB_NAME}
# run the image interactively
docker run --env PREFECT__CONTEXT__SECRETS__DSN -it prefectpoc
```

## Running Initial Load with Docker

Populating a new database from Socrata requires a few additional settings. They are found in the TOML
file but the easiest way to provide them is using environment variables.

```bash
# set the DSN as an environment variable
export PREFECT__CONTEXT__SECRETS__DSN=postgresql://{USER}:{PASSWORD}@{HOST}:{PORT}/{DB_NAME}
export PREFECT__MODE=full  # specify that this is a full data loadd
export PREFECT__RESET_DB=true  # to wipe any existing requests data
export PREFECT__DATA__YEARS=["2020","2019"]  # the years to load as a string list
# run the image interactively
docker run -e PREFECT__CONTEXT__SECRETS__DSN -e PREFECT__MODE -e PREFECT__RESET_DB -e PREFECT__DATA__YEARS -it prefectpoc
# or do the above with an environment file and the --env-file argument
```

## Running the app locally

To load data into an API database:

* Download this project and cd into the project folder
* Create a virtual environment for the project (e.g. pipenv --python 3.7)
* Do a pip install of the dependencies from the requirements.txt
* Run the flow as follows:

```bash
export PREFECT__USER_CONFIG_PATH=./config.toml
export PREFECT__CONTEXT__SECRETS__DSN=postgresql://{USER}:{PASSWORD}@{HOST}:{PORT}/{DB_NAME}
python flow.py
```

## Enabling Slack notifications

The flow supports sending a final status notification to Slack. To configure this, simply add your Slack webhook URL
to the configuration secrets like you did for the DSN. (Note: this needs to be treated as a secret since Slack webhooks
are otherwise not authenticated.)

```bash
PREFECT__CONTEXT__SECRETS__SLACK_HOOK=https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX
```

## Configuration

Configuration is done via a TOML file called config.toml in the project root. This uses the Prefect mechanism for [configuration](https://docs.prefect.io/core/concepts/configuration.html#toml). The Prefect default is to look for this file in the USER home directory so a special environment variable (PREFECT__USER_CONFIG_PATH) needs to be set in order to discover this in the project root.

### Secrets

The database URL (DSN) secrets are expected to be provided as environment variables. This needs to follow the Prefect convention and be prefixed with 'PREFECT__CONTEXT__SECRETS__' in order for it to be treated by Prefect as a Secret.

### Flow configuration

* mode: either *'full'* whether all records for the matching 'year' setting or *'update'* whether to download new and updated records using the 'since' setting
* domain: the path to the Socrata instance (e.g. "data.lacity.org")
* dask: setting this to True will run the download steps in parallel
* datasets: a dictionary of available years and Socrata dataset keys

### Data configuration

* fields: a dictionary of fields and their Postgres data type (note that this will assume varchar unless specified otherwise)
* key: the field to be used to manage inserts/updates (e.g. "srnumber")
* target: the name of the table to be ultimately loaded (e.g. "requests")
* years: the years to be loaded
* since: will only load records change since this date (note that if since is specified it will load updated data for ALL years)

## Helpful Postgres commands to watch your database

```sql
select pg_size_pretty (pg_database_size('311_db'));
select pg_size_pretty (pg_relation_size('requests'));
select pg_size_pretty (pg_indexes_size('requests'));

-- get the database objects by total size
SELECT
    relname AS "relation",
    pg_size_pretty ( pg_total_relation_size (C .oid) ) AS "total_size"
FROM pg_class C
LEFT JOIN pg_namespace N ON (N.oid = C .relnamespace)
WHERE nspname NOT IN ('pg_catalog', 'information_schema')
AND C .relkind <> 'i'
AND nspname !~ '^pg_toast'
ORDER BY pg_total_relation_size (C .oid) DESC
LIMIT 10;
```

To clear out the Redis cache of an existing API instance:

```bash
curl -X POST "http://localhost:5000/status/reset-cache" -H  "accept: application/json" -d ""
```

### Docker commands

```bash
# build the image
docker build . -t prefectpoc:latest
# login to GitHub packages
cat ~/GH_TOKEN.txt | docker login docker.pkg.github.com -u mattyweb --password-stdin
# tag the package
docker tag 0a44395490cc docker.pkg.github.com/mattyweb/prefect-poc/prefectpoc:latest
# push the package to GitHub packages
docker push docker.pkg.github.com/mattyweb/prefect-poc/prefectpoc:latest
```
