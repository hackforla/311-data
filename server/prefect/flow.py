import sys

import prefect
from prefect import Flow, Parameter
from prefect.engine.executors import LocalDaskExecutor, LocalExecutor
from prefect.utilities.edges import unmapped

from tasks import postgres, socrata, cache


"""
Flow: Loading Socrata Data to Postgres
--------------------------------------
This flow downloads data from the Socrata Open Data site and loads it
into a Postgres database.

Behavior is configured in the config.toml
"""

with Flow(
        'Loading Socrata data to Postgres',
        state_handlers=[postgres.log_to_database]
) as flow:

    datasets = Parameter("datasets")

    # get last updated from database
    since = postgres.get_start_datetime()
    # download dataset from Socrata
    downloads = socrata.download_dataset.map(
        dataset=datasets,
        since=unmapped(since)
    )
    # get the temp tables ready for load
    prep = postgres.prep_load()
    # load each downloaded file
    load = postgres.load_datafile.map(
        datafile=downloads
    )
    # commit new data to database and clean up
    complete = postgres.complete_load()

    # clear the API cache
    clear = cache.clear_cache()

    # clear the API cache
    reload = cache.reload_reports()

    # make sure prep runs before load
    flow.add_edge(upstream_task=prep, downstream_task=load)
    # make sure load runs before complete
    flow.add_edge(upstream_task=load, downstream_task=complete)
    # make sure complete runs before cache is cleared
    flow.add_edge(upstream_task=complete, downstream_task=clear)
    # make sure load runs before complete
    flow.add_edge(upstream_task=clear, downstream_task=reload)

if __name__ == "__main__":
    logger = prefect.context.get("logger")

    dask = prefect.config.dask
    reset_db = prefect.config.reset_db

    all_datasets = dict(prefect.config.socrata.datasets)
    years = list(prefect.config.data.years)

    # use only datasets for configured years
    run_datasets = dict((k, all_datasets[str(k)]) for k in years)

    logger.info(f"Starting update flow for {', '.join(map(str, run_datasets.keys()))}"
                f" {'and resetting db' if reset_db else ''}")

    state = flow.run(
        datasets=list(run_datasets.values()),
        executor=LocalDaskExecutor() if dask else LocalExecutor()
    )

    if state.is_finished() and state.is_failed():
        sys.exit(1)  # exit with error if flow state is failed
