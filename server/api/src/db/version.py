from .conn import exec_sql


def version():
    '''
    returns:
        -1 ==> if metadata table doesn't exist
         0 ==> if metadata table doesn't include 'version'
       > 0 ==> the version in the metadata table
    '''

    meta_exists = exec_sql("""
        SELECT EXISTS (
            SELECT FROM information_schema.tables
            WHERE table_schema = 'public'
            AND   table_name   = 'metadata'
       )
    """).first()[0]

    if not meta_exists:
        return -1

    meta = exec_sql('SELECT * FROM metadata LIMIT 1').first()

    if not hasattr(meta, 'version'):
        return 0
    else:
        return meta.version
