from datetime import datetime
import os
from os.path import join
from typing import Dict
import requests

import psycopg2
import prefect
from prefect.utilities.tasks import task

"""
Interact with a Postgres database powering a 311 data API

Works in 3 stages:
- prepping the load
- loading files to temp table
- committing temp data to database
"""

TEMP_TABLE = "temp_loading"


def infer_types(fields: Dict[str, str]) -> Dict[str, str]:
    """
    gets datatypes for unset fields
    """
    return_fields = {}
    for key in fields.keys():
        if fields[key] == '':
            if key[-4:] == 'date':
                return_fields[key] = "timestamp without time zone"
            elif key in {'latitude', 'longitude'}:
                return_fields[key] = "double precision"
            else:
                return_fields[key] = "character varying"
        else:
            return_fields[key] = fields[key]

    return return_fields


@task
def get_last_updated() -> datetime:
    logger = prefect.context.get("logger")
    target = prefect.config.data.target
    recent_column = prefect.config.data.recent_column
    dsn = prefect.context.secrets["DSN"]
    connection = psycopg2.connect(dsn)
    cursor = connection.cursor()

    # get last updated
    query = f"select max({recent_column}) from {target}"
    cursor.execute(query)
    last_updated = cursor.fetchone()[0]
    connection.commit()

    cursor.close()
    connection.close()

    logger.info(last_updated)
    return last_updated


@task
def prep_load():
    """
    creates the temp loading table if needed
    and cleans it from last run data
    cleans target table if configured
    """
    logger = prefect.context.get("logger")

    dsn = prefect.context.secrets["DSN"]
    connection = psycopg2.connect(dsn)
    cursor = connection.cursor()

    fields = infer_types(prefect.config.data.fields)
    reset_db = prefect.config.reset_db
    target = prefect.config.data.target

    query = f"""
        CREATE TABLE IF NOT EXISTS {TEMP_TABLE} (
            {', '.join([f"{field} {fields[field]}" for field in fields])}
        );
    """
    cursor.execute(query)
    logger.info("Resetting data")
    cursor.execute(f"TRUNCATE TABLE {TEMP_TABLE};")
    logger.info(f"'{TEMP_TABLE}' table truncated")

    if reset_db:
        cursor.execute(f"TRUNCATE {target} RESTART IDENTITY;")
        cursor.execute(f"ALTER SEQUENCE {target}_id_seq RESTART WITH 1;")
        logger.info(f"'{target}' table truncated")

    connection.commit()
    cursor.close()
    connection.close()


@task
def load_datafile(datafile: str):
    """
    Loads the temp table from a single data file
    """
    logger = prefect.context.get("logger")
    dsn = prefect.context.secrets["DSN"]
    temp_folder = prefect.config.temp_folder or "output"

    connection = psycopg2.connect(dsn)
    cursor = connection.cursor()

    logger.info(f"Loading data from file: {datafile}")
    try:
        with open(join(temp_folder, datafile), 'r') as f:
            try:
                cursor.copy_expert(
                    f"COPY {TEMP_TABLE} FROM STDIN WITH (FORMAT CSV, HEADER TRUE)",
                    f
                )
                connection.commit()
                logger.info(f"Table '{TEMP_TABLE}' successfully loaded "
                            f"from {os.path.basename(datafile)}")
            except (Exception, psycopg2.DatabaseError) as error:
                logger.info("Error: %s" % error)
                connection.rollback()
                cursor.close()
    except FileNotFoundError:
        logger.info(f"No file ({datafile}). Skipping...")

    cursor.close()
    connection.close()


@task
def complete_load() -> Dict[str, int]:
    """
    Commit the data from the temp table to database
    Does both insert and then updates to data
    Does a database vacuum and analyze
    """
    logger = prefect.context.get("logger")
    dsn = prefect.context.secrets["DSN"]
    reset_db = prefect.config.reset_db
    fieldnames = list(prefect.config.data.fields.keys())
    key = prefect.config.data.key
    target = prefect.config.data.target

    connection = psycopg2.connect(dsn)
    cursor = connection.cursor()
    rows_inserted = 0
    rows_updated = 0

    insert_query = f"""
        -- BEGIN;

        WITH rows AS (
            INSERT INTO {target} (
                {', '.join([f"{field}" for field in fieldnames])}
            )
            SELECT *
            FROM {TEMP_TABLE}
            ON CONFLICT ({key})
            DO NOTHING
            RETURNING 1
        )
        SELECT count(*) FROM rows;

        -- COMMIT;
    """

    update_query = f"""
        WITH rows AS (
            UPDATE {target}
            SET
                {', '.join([f"{field} = source.{field}" for field in fieldnames])}
            FROM (SELECT * FROM {TEMP_TABLE}) AS source
            WHERE {target}.{key} = source.{key}
            AND {target}.updateddate != source.updateddate
            RETURNING 1
        )
        SELECT count(*) FROM rows;
    """

    # count rows to be upserted
    cursor.execute(f"SELECT COUNT(*) FROM {TEMP_TABLE}")
    rows_to_upsert = cursor.fetchone()[0]
    logger.info(f"Insert/updating '{target}' table with {rows_to_upsert:,} new records")

    # insert rows
    cursor.execute(insert_query)
    rows_inserted = cursor.fetchone()[0]
    connection.commit()
    logger.info(f"{rows_inserted:,} rows inserted in table '{target}'")

    # update rows if necessary
    if reset_db is False:
        cursor.execute(update_query)
        rows_updated = cursor.fetchone()[0]
        connection.commit()
    else:
        rows_updated = 0

    logger.info(f"{rows_updated:,} rows updated in table '{target}'")

    if rows_inserted > 0 or rows_updated > 0:
        # empty temp table if resetting the db
        if reset_db:
            cursor.execute(f"TRUNCATE TABLE {TEMP_TABLE}")

        # refresh views
        for view in prefect.config.data.views:
            cursor.execute(f"REFRESH MATERIALIZED VIEW CONCURRENTLY {view};")
        connection.commit()
        logger.info("Views successfully refreshed")

        # need to have autocommit set for VACUUM to work
        connection.autocommit = True
        cursor.execute("VACUUM FULL ANALYZE")
        logger.info("Database vacuumed and analyzed")

    cursor.close()
    connection.close()

    return {
        "inserted": rows_inserted,
        "updated": rows_updated
    }


def log_to_database(task, old_state, new_state):
    """
    Write the output to database at the end of the flow
    """
    if new_state.is_finished():

        logger = prefect.context.get("logger")

        result_dict = {}
        for i in task.tasks:
            result_dict[i.name] = new_state.result[i]._result.value

        if new_state.is_failed():
            status = "ERROR"
            emoji = " :rage: "
            msg = f"FAILURE: Something went wrong in {task.name}: "\
                f"\"{new_state.message}\""
        elif new_state.is_successful():
            status = "INFO"
            emoji = " :grin: "
            msg = f"\"{task.name}\" loaded "\
                f"[{result_dict['complete_load']['inserted']:,}] records, "\
                f"updated [{result_dict['complete_load']['updated']:,}] records, "\
                f"and finished with message \"{new_state.message}\""
        else:
            status = "WARN"
            emoji = " :confused: "
            msg = f"Something might have failed in {task.name}: {new_state.message}"

        # write task results to database
        dsn = prefect.context.secrets["DSN"]
        connection = psycopg2.connect(dsn)
        cursor = connection.cursor()

        # table_query = """
        #     CREATE TABLE IF NOT EXISTS log (
        #         id SERIAL PRIMARY KEY,
        #         status character varying DEFAULT 'INFO'::character varying,
        #         message text,
        #         created_time timestamp without time zone DEFAULT now()
        #     );
        # """

        insert_query = f"""
            INSERT INTO log (status, message)
            VALUES ('{status}', '{msg}')
        """
        # cursor.execute(table_query)
        # connection.commit()
        cursor.execute(insert_query)
        connection.commit()
        cursor.close()
        connection.close()

        # try posting to Slack
        try:
            slack_url = prefect.context.secrets["SLACK_HOOK"]
            if slack_url:
                requests.post(slack_url, json={"text": emoji + msg})
        except Exception as e:
            logger.warn(f"Unable to post to Slack: {e}")

        # log task results
        logger.info(msg)

        return new_state
