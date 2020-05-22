import pandas as pd
from .data_access import load_batch, load_meta


def get_batch_nums(table, startDate, endDate):
    batches = load_meta(table)['batches']

    return [batch_num for batch_num, batch in enumerate(batches) if (
        startDate <= pd.to_datetime(batch['endDate']) and
        endDate >= pd.to_datetime(batch['startDate'])
    )]


def query(table, fields, filters):
    print('QUERYING PICKLEBASE')

    startDate = pd.to_datetime(filters['startDate'])
    endDate = pd.to_datetime(filters['endDate'])
    requestTypes = filters['requestTypes']
    ncList = filters.get('ncList')
    cdList = filters.get('cdList')

    batches = []
    for batch_num in get_batch_nums(table, startDate, endDate):
        df = load_batch(table, batch_num)

        if len(ncList) > 0:
            district_filter = df['nc'].isin(ncList)
        else:
            district_filter = df['cd'].isin(cdList)

        batch = df.loc[(
            (df['createddate'] > startDate) &
            (df['createddate'] < endDate) &
            df['requesttype'].isin(requestTypes) &
            district_filter
        ), fields]

        batches.append(batch)

    if len(batches) > 0:
        all = pd.concat(batches, ignore_index=True)
        for c in all.columns:
            if hasattr(all[c], 'cat'):
                all[c].cat.remove_unused_categories(inplace=True)
        return all
    else:
        return pd.DataFrame(columns=fields)
