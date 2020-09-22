import os
from os.path import join, dirname
import gzip
import psycopg2


DATA_FOLDER = join(dirname(__file__), '../data')

VIEW_REFRESH_SQL = """
        REFRESH MATERIALIZED VIEW CONCURRENTLY map;
        REFRESH MATERIALIZED VIEW CONCURRENTLY vis;
        REFRESH MATERIALIZED VIEW CONCURRENTLY service_requests;
"""


def load_data(dsn):
    with gzip.open(join(DATA_FOLDER, 'requests.csv.gz'), 'rt') as f:

        connection = psycopg2.connect(dsn)
        cursor = connection.cursor()
        print("Database connection established")

        try:
            cursor.execute("truncate table requests")
            cursor.copy_expert(
                "COPY requests FROM STDIN WITH (FORMAT CSV, HEADER TRUE)",
                f
            )
            cursor.execute("INSERT INTO metadata (last_pulled) VALUES (NOW())")
            connection.commit()
            print("Table 'requests' successfully reloaded")

            cursor.execute(VIEW_REFRESH_SQL)
            connection.commit()
            print("Views successfully refreshed")

        except (Exception, psycopg2.DatabaseError) as error:
            print("Error: %s" % error)
            connection.rollback()
            cursor.close()

    cursor.close()
    connection.close()
    print("Database connection closed")


if __name__ == '__main__':

    dsn = os.getenv(
        "DATABASE_URL",
        "postgresql://311_user:311_pass@localhost:5433/311_db"
    )

    load_data(dsn)
