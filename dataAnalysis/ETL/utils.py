import numpy as np
import pandas as pd
from datetime import datetime

from shapely import wkt

def fill_placeholder_1900(df):
    return df.replace(to_replace=pd.to_datetime('1900'),value=pd.NaT)

def to_datetime(df):
    dt_cols = ['CreatedDate','UpdatedDate','ServiceDate','ClosedDate']
    for col in dt_cols:
        df[col] = pd.to_datetime(df[col])

def fill_placeholder_1900_col(df):
    dt_cols = ['CreatedDate','UpdatedDate','ServiceDate','ClosedDate']
    for col in dt_cols:
        df[col] = df[col].replace(to_replace=pd.to_datetime('1900'),value=pd.NaT)

def fill_placeholder_ongoing(df, cols):
    for col in cols:
        df[col] = df[col].replace(to_replace=pd.NaT, value=datetime.now())
        # df.loc[df[col] == 'NaT', col] = datetime.now()

def ddiff2days(ddiff):
    if not pd.isnull(ddiff):
        return pd.Timedelta.total_seconds(ddiff)/(24.*3600)
    else:
        return np.NaN

def to_points(p):
    if type(p) == float:
        return p
    else:
        return wkt.loads('Point{}'.format(p.replace(',',' ')))
    
def to_geom(df):
    df['Location'] = df.Location.apply(to_points)

def add_datediff_cols(df):
    df['ClosedDiff'] = df.ClosedDate - df.CreatedDate
    df['ServiceDiff'] = df.ServiceDate - df.CreatedDate
    df['ClosedServiceDiff'] = df.ClosedDate - df.ServiceDate
    df['ClosedDiff_Days'] = df.ClosedDiff.apply(ddiff2days)
    df['ServiceDiff_Days'] = df.ServiceDiff.apply(ddiff2days)
    df['ClosedServiceDiff_Days'] = df.ClosedServiceDiff.apply(ddiff2days)