from .conn import exec_sql


def create_table():
    exec_sql("""
        CREATE TABLE metadata AS
        SELECT * FROM (VALUES (NOW())) as vals(last_pulled)
    """)


def update():
    exec_sql("""
        UPDATE metadata SET last_pulled = NOW()
    """)


def last_updated():
    rows = exec_sql('SELECT last_pulled FROM metadata')
    last_pulled = rows.first().last_pulled
    return last_pulled.replace(tzinfo=None, microsecond=0)


def years():
    rows = exec_sql("""
        SELECT DISTINCT date_part('year', createddate) as years
        FROM requests
    """)
    return sorted([int(row[0]) for row in rows.fetchall()])


def rows():
    res = exec_sql("""
        SELECT date_part('year', createddate) as year, COUNT(*)
        FROM requests
        GROUP BY year
    """)
    years = {int(year): count for year, count in res.fetchall()}
    return {
        'byYear': years,
        'total': sum(years.values())
    }


def tables():
    def count(table):
        res = exec_sql(f"""
            SELECT COUNT(*) FROM {table}
        """)
        return res.first()[0]

    return {table: count(table) for table in [
        'requests',
        'map',
        'vis'
    ]}
