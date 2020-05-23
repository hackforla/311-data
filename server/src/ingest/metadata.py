from utils.database import db


def create_metadata_table():
    db.exec_sql(f"""
        CREATE TABLE metadata AS
        SELECT * FROM (VALUES (NOW())) as vals(last_pulled)
    """)


def update_metadata_table():
    db.exec_sql(f"""
        UPDATE metadata
        SET last_pulled = NOW()
    """)
