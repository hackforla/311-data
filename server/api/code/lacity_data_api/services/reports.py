import pandas as pd

from ..models import db, request_type
from .stats import box_plots, date_bins, date_histograms, counts


async def get_visualization(startDate,
                         endDate,
                         requestTypes=[],
                         ncList=[]):
    """
    Runs a report on a single distict that includes request totals by date,
    request types, and request sources.

    Updated to use the service_requests materialized view with joins to other tables.
    """

    bins, start, end = date_bins(startDate, endDate)

    type_ids = await request_type.get_type_ids_by_str_list(requestTypes)
    typeList = (', ').join([str(rt) for rt in type_ids])
    ncList = (', ').join([str(nc) for nc in ncList])

    query = db.text(f"""
        SELECT
            type_name as requesttype,
            created_date as createddate,
            closed_date - created_date as _daystoclose,
            requestsource
        FROM
            service_requests
        LEFT JOIN requests on service_requests.request_id = requests.id
        LEFT JOIN request_types on service_requests.type_id = request_types.type_id
        WHERE
            service_requests.created_date >= '{startDate}' AND
            service_requests.created_date <= '{endDate}' AND
            service_requests.type_id IN ({typeList}) AND
            service_requests.council_id IN ({ncList})
        """)

    result = await db.all(query)

    df = pd.DataFrame(
        result,
        columns=['requesttype', 'createddate', '_daystoclose', 'requestsource']
    )

    return {
        'frequency': {
            'bins': list(bins.astype(str)),
            'counts': date_histograms(
                df,
                dateField='createddate',
                bins=bins,
                groupField='requesttype',
                groupFieldItems=requestTypes)
        },
        'timeToClose': box_plots(
            df,
            plotField='_daystoclose',
            groupField='requesttype',
            groupFieldItems=requestTypes
        ),
        'counts': {
            'type': counts(df, groupField='requesttype'),
            'source': counts(df, groupField='requestsource')
        }
    }


async def freq_comparison(startDate,
                          endDate,
                          requestTypes=[],
                          set1={'district': None, 'list': []},
                          set2={'district': None, 'list': []}):

    async def get_data(district, items, bins, start, end, requestTypes):
        filters = {
            'startDate': start,
            'endDate': end,
            'requestTypes': requestTypes}

        if district == 'cc':
            filters['cdList'] = items
            groupField = 'city_id'
        else:
            filters['ncList'] = items
            groupField = 'council_id'

        type_ids = await request_type.get_type_ids_by_str_list(requestTypes)
        typeList = (', ').join([str(rt) for rt in type_ids])

        ncList = filters.get('ncList', [])
        cdList = filters.get('cdList', [])

        if len(cdList) > 0:
            cdList = (', ').join([str(cd) for cd in cdList])
            where = f'city_id IN ({cdList})'
        else:
            ncList = (', ').join([str(nc) for nc in ncList])
            where = f'council_id IN ({ncList})'

        query = db.text(f"""
            SELECT
                {groupField},
                created_date
            FROM
                service_requests
            WHERE
                created_date >= '{start}' AND
                created_date <= '{end}' AND
                type_id IN ({typeList}) AND
                {where}
            """)

        result = await db.all(query)

        df = pd.DataFrame(
            result,
            columns=[groupField, 'created_date']
        )

        return date_histograms(
            df,
            dateField='created_date',
            bins=bins,
            groupField=groupField,
            groupFieldItems=items
        )

    bins, start, end = date_bins(startDate, endDate)

    set1data = await get_data(
        set1['district'],
        set1['list'],
        bins,
        start,
        end,
        requestTypes
    )
    set2data = await get_data(
        set2['district'],
        set2['list'],
        bins,
        start,
        end,
        requestTypes
    )

    return {
        'bins': list(bins.astype(str)),
        'set1': {
            'district': set1['district'],
            'counts': set1data},
        'set2': {
            'district': set2['district'],
            'counts': set2data}}


async def ttc_comparison(startDate,
                         endDate,
                         requestTypes=[],
                         set1={'district': None, 'list': []},
                         set2={'district': None, 'list': []}):

    async def get_data(district, items, requestTypes):
        filters = {
            'startDate': startDate,
            'endDate': endDate,
            'requestTypes': requestTypes}

        if district == 'cc':
            filters['cdList'] = items
            groupField = 'city_id'
        else:
            filters['ncList'] = items
            groupField = 'council_id'

        type_ids = await request_type.get_type_ids_by_str_list(requestTypes)
        typeList = (', ').join([str(rt) for rt in type_ids])

        ncList = filters.get('ncList', [])
        cdList = filters.get('cdList', [])

        if len(cdList) > 0:
            cdList = (', ').join([str(cd) for cd in cdList])
            where = f'city_id IN ({cdList})'
        else:
            ncList = (', ').join([str(nc) for nc in ncList])
            where = f'council_id IN ({ncList})'

        query = db.text(f"""
            SELECT
                {groupField},
                cast (extract(days FROM (closeddate - createddate)) as double precision)
                    as days_to_close
            FROM
                service_requests
            LEFT JOIN
                requests on requests.id = service_requests.request_id
            WHERE
                created_date >= '{startDate}' AND
                created_date <= '{endDate}' AND
                type_id IN ({typeList}) AND
                {where}
            """)

        result = await db.all(query)

        df = pd.DataFrame(
            result,
            columns=[groupField, 'days_to_close']
        )

        return box_plots(
            df,
            plotField='days_to_close',
            groupField=groupField,
            groupFieldItems=items
        )

    set1data = await get_data(set1['district'], set1['list'], requestTypes)
    set2data = await get_data(set2['district'], set2['list'], requestTypes)

    return {
        'set1': {
            'district': set1['district'],
            'data': set1data},
        'set2': {
            'district': set2['district'],
            'data': set2data}}


async def counts_comparison(startDate,
                            endDate,
                            requestTypes=[],
                            set1={'district': None, 'list': []},
                            set2={'district': None, 'list': []}):

    async def get_data(district, items, requestTypes):
        filters = {
            'startDate': startDate,
            'endDate': endDate,
            'requestTypes': requestTypes}

        if district == 'cc':
            filters['cdList'] = items
            # groupField = 'cd'
        else:
            filters['ncList'] = items
            # groupField = 'nc'

        type_ids = await request_type.get_type_ids_by_str_list(requestTypes)
        typeList = (', ').join([str(rt) for rt in type_ids])

        ncList = filters.get('ncList', [])
        cdList = filters.get('cdList', [])

        if len(cdList) > 0:
            cdList = (', ').join([str(cd) for cd in cdList])
            where = f'city_id IN ({cdList})'
        else:
            ncList = (', ').join([str(nc) for nc in ncList])
            where = f'council_id IN ({ncList})'

        query = db.text(f"""
            SELECT
                requestsource
            FROM
                service_requests
            LEFT JOIN
                requests on requests.id = service_requests.request_id
            WHERE
                created_date >= '{startDate}' AND
                created_date <= '{endDate}' AND
                type_id IN ({typeList}) AND
                {where}
            """)

        result = await db.all(query)

        df = pd.DataFrame(
            result,
            columns=['requestsource']
        )

        return counts(df, 'requestsource')

    set1data = await get_data(set1['district'], set1['list'], requestTypes)
    set2data = await get_data(set2['district'], set2['list'], requestTypes)

    return {
        'set1': {
            'district': set1['district'],
            'source': set1data},
        'set2': {
            'district': set2['district'],
            'source': set2data}}
