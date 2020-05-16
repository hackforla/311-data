from config import config
from services.sqlIngest import DataHandler


if __name__ == '__main__':
    conf = config['Ingestion']

    years = [int(year) for year in conf['YEARS'].split(',')]
    limit = conf['LIMIT']
    querySize = min(limit, conf['QUERY_SIZE'])

    DataHandler().populateDatabase(years, limit, querySize)
