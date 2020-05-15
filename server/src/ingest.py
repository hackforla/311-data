import os
from configparser import ConfigParser
from utils.database import db
from services.sqlIngest import DataHandler


if __name__ == '__main__':
    config = ConfigParser()
    settings_file = os.path.join(os.getcwd(), 'settings.cfg')
    config.read(settings_file)

    db.config(config['Database'])
    loader = DataHandler(config)
    ingestion = config['Ingestion']

    years = [int(year) for year in ingestion['YEARS'].split(',')]
    limit = int(ingestion['LIMIT'])
    querySize = int(ingestion['QUERY_SIZE'])

    querySize = min([limit, querySize])

    loader.populateDatabase(years, limit, querySize)
