import db
from config import config


if __name__ == '__main__':
    db.reset()
    db.requests.add_years(config['Ingestion']['YEARS'])
