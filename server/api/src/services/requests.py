import pandas as pd
import db
import pb


DEFAULT_TABLE = 'requests'


def item_query(srnumber, table=DEFAULT_TABLE):
    item = db.exec_sql(f"""
        SELECT * FROM {table}
        WHERE srnumber = '{srnumber}'
    """).first()

    if item is None:
        return None
    else:
        return dict(item)


def standard_query(fields, filters, table=DEFAULT_TABLE):

    # parse filters
    startDate = filters.get('startDate')
    endDate = filters.get('endDate')
    requestTypes = filters.get('requestTypes')
    ncList = filters.get('ncList')

    # validate input
    if not isinstance(fields, list) or len(fields) == 0:
        raise Exception('fields must be provided')

    if (
        startDate is None or
        endDate is None or
        not isinstance(requestTypes, list) or
        not isinstance(ncList, list)
    ):
        raise Exception('invalid filters')

    # try picklebase
    if pb.available():
        return pb.query(table, fields, filters)

    # hit database
    fields = (', ').join(fields)
    requestTypes = (', ').join([f"'{rt}'" for rt in requestTypes])
    ncList = (', ').join([str(nc) for nc in ncList])

    return pd.read_sql(f"""
        SELECT {fields}
        FROM {table}
        WHERE
            createddate >= '{startDate}' AND
            createddate <= '{endDate}' AND
            requesttype IN ({requestTypes}) AND
            nc IN ({ncList})
    """, db.engine)


def comparison_query(fields, filters, table=DEFAULT_TABLE):

    # parse filters
    startDate = filters.get('startDate')
    endDate = filters.get('endDate')
    requestTypes = filters.get('requestTypes')
    ncList = filters.get('ncList', [])
    cdList = filters.get('cdList', [])

    # validate input
    if not isinstance(fields, list) or len(fields) == 0:
        raise Exception('fields must be provided')

    if (
        startDate is None or
        endDate is None or
        not isinstance(requestTypes, list) or
        not isinstance(ncList, list) or
        not isinstance(cdList, list)
    ):
        raise Exception('invalid filters')

    # try picklebase
    if pb.available():
        return pb.query(table, fields, filters)

    # hit database
    fields = (', ').join(fields)
    requestTypes = (', ').join([f"'{rt}'" for rt in requestTypes])

    if len(ncList) > 0:
        ncList = (', ').join([str(nc) for nc in ncList])
        where = f'nc IN ({ncList})'
    else:
        cdList = (', ').join([str(cd) for cd in cdList])
        where = f'cd IN ({cdList})'

    return pd.read_sql(f"""
        SELECT {fields}
        FROM {table}
        WHERE
            createddate >= '{startDate}' AND
            createddate <= '{endDate}' AND
            requesttype IN ({requestTypes}) AND
            {where}
    """, db.engine)


async def open_requests():

    def counts_by_field(df, field):
        counts = df.groupby(by=[field, 'requesttype']).size().to_dict()
        out = {}
        for (nc, requesttype), count in counts.items():
            nc = int(nc)
            if nc not in out:
                out[nc] = {}
            out[nc][requesttype] = count
        return out

    df = pd.read_sql('SELECT * FROM open_requests', db.engine)

    return {
        'requests': df[[
            'srnumber',
            'requesttype',
            'latitude',
            'longitude'
        ]].to_dict(orient='records'),

        'counts': {
            'nc': counts_by_field(df, 'nc'),
            'cc': counts_by_field(df, 'cd')}}
