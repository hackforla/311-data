import db
import pandas as pd


def get_ncs():
    """
    Gets a sorted list of all NCs in the data
    """
    df = pd.read_sql("""
        select distinct nc from requests
        where nc is not null
        order by nc
    """, db.engine)
    return df['nc'].tolist()


def get_request_types():
    """
    Gets a sorted list of all request types in the data
    """
    df = pd.read_sql("""
        select distinct requesttype from requests
        where requesttype is not null
        order by requesttype
    """, db.engine)
    return df['requesttype'].tolist()
