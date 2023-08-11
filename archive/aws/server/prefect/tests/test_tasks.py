import requests
from datetime import datetime

import prefect
from prefect.engine import TaskRunner
from prefect.engine.state import Running
from prefect.engine.result import Result
from pendulum import parse

from tasks import postgres, socrata


def test_download_data():
    with prefect.context(today=datetime.today().strftime('%Y-%m-%d')):
        new_state = TaskRunner(
            task=socrata.download_dataset
        ).get_task_run_state(
            state=Running(),
            inputs={
                "dataset": Result("rq3b-xjk8"),
                "since": Result(parse('2020-09-21', tz=None))
            }
        )
        assert new_state.is_successful()


def test_prep_load():
    runner = TaskRunner(task=postgres.prep_load)
    state = runner.run()
    assert state.is_successful()


def test_load_datafile():
    new_state = TaskRunner(
        task=postgres.load_datafile
    ).get_task_run_state(
        state=Running(),
        inputs={"datafile": Result("rq3b-xjk8-full.csv")}
    )
    assert new_state.is_successful()


def test_complete_load():
    runner = TaskRunner(task=postgres.complete_load)
    state = runner.run()
    assert state.is_successful()


# def test_cache_reset():
#     result = api.reset_api_cache()
#     assert result == "Cache successfully reset"


def test_socrata_endpoint():
    import prefect

    fieldnames = list(prefect.config.data.fields.keys())
    since = "2020-01-10T01:39:13"

    domain = "data.lacity.org"
    dataset = "pvft-t768"
    app_token = "6b5lwk1jHSQTgx7PAVFKOOdt2"

    limit = 50000
    offset = 0
    where = f"updateddate > '{datetime.strptime(since, '%Y-%m-%dT%H:%M:%S').isoformat()}'"  # noqa
    select = ",".join(fieldnames)

    url = f"https://{domain}/resource/{dataset}.json"
    headers = {
        "X-App-Token": app_token
    }
    params = {
        "$limit": limit,
        "$offset": offset,
        "$select": select
    }

    if where:
        params["$where"] = where

    response = requests.get(url, headers=headers, params=params)

    assert len(response.json()) > 0
