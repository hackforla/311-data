import pandas as pd
from .data_access import init_table, save_batch, save_meta


def load_batch(engine, from_table, with_fields, batch_size, batch_number):
    return pd.read_sql(f"""
        SELECT {(', ').join(with_fields)}
        FROM {from_table}
        ORDER BY createddate ASC
        LIMIT {batch_size}
        OFFSET {batch_size * batch_number}
    """, engine)


def commit_batch(table, batch_num, batch):
    def to_megs(bytes):
        return '{} MB'.format(round(bytes / 10**6, 2))

    num_rows = len(batch)
    startDate = batch.iloc[0]['createddate'].isoformat()
    endDate = batch.iloc[-1]['createddate'].isoformat()
    memory_size = batch.memory_usage(deep=True).sum()
    filename, disk_size = save_batch(table, batch_num, batch)

    print('\tSaved batch {}: {} rows'.format(batch_num, num_rows), flush=True)

    return {
        'filename': filename,
        'sizeOnDisk': to_megs(disk_size),
        'sizeInMemory': to_megs(memory_size),
        'rows': num_rows,
        'startDate': startDate,
        'endDate': endDate}


def create_table(table,
                 from_table,
                 with_fields,
                 engine,
                 batch_size,
                 optimize=None):

    print('\nCreating table: {}'.format(table), flush=True)
    print('From table: {}'.format(from_table), flush=True)
    print('With fields: {}'.format(with_fields), flush=True)

    init_table(table)

    batches = []
    batch_num = 0
    while True:
        batch = load_batch(
            engine,
            from_table,
            with_fields,
            batch_size,
            batch_num)

        if len(batch) == 0:
            break

        if optimize is not None:
            optimize(batch)

        batch_meta = commit_batch(table, batch_num, batch)
        batches.append(batch_meta)
        batch_num += 1

    meta = {
        'table': table,
        'from': from_table,
        'fields': with_fields,
        'totalRows': sum([batch['rows'] for batch in batches]),
        'batches': batches}

    save_meta(table, meta)
    return meta
