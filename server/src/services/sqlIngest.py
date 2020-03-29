from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.sql import text
import time
from .databaseOrm import Ingest, Base
from .socrataClient import SocrataClient


def log(message):
    print(message, flush=True)


class Timer():
    def __init__(self):
        self.start = time.perf_counter()

    def end(self):
        return round((time.perf_counter() - self.start) / 60, 2)


class DataHandler:
    def __init__(self, config=None):
        self.engine = create_engine(config['DB_CONNECTION_STRING'])
        self.session = sessionmaker(bind=self.engine)()
        self.socrata = SocrataClient()

    def __del__(self):
        self.session.close()

    def resetDatabase(self):
        log('\nResetting database.')
        Base.metadata.drop_all(self.engine)
        Base.metadata.create_all(self.engine)

    def fetchData(self, year, offset, limit):
        log('\tFetching {} rows, offset {}'.format(limit, offset))
        return self.socrata.get(year,
                                select="*",
                                offset=offset,
                                limit=limit)

    def insertData(self, rows):
        self.session.bulk_insert_mappings(Ingest, rows)
        self.session.commit()

    def ingestYear(self, year, limit, querySize):
        log('\nIngesting up to {} rows for year {}'.format(limit, year))
        timer = Timer()

        rowsInserted = 0
        endReached = False

        for offset in range(0, limit, querySize):
            rows = self.fetchData(year, offset, querySize)
            self.insertData(rows)
            rowsInserted += len(rows)

            if len(rows) < querySize:
                endReached = True
                break

        minutes = timer.end()
        log('\tDone with {} after {} minutes.'.format(year, minutes))
        log('\tRows inserted: {}'.format(rowsInserted))

        return {
            'year': year,
            'rowsInserted': rowsInserted,
            'endReached': endReached,
            'minutesElapsed': minutes,
        }

    def cleanTable(self):
        def exec_sql(sql):
            with self.engine.connect() as conn:
                return conn.execute(text(sql))

        def dropDuplicates(table, report):
            rows = exec_sql(f"""
                DELETE FROM {table} a USING {table} b
                WHERE a.id < b.id AND a.srnumber = b.srnumber;
            """)

            report.append({
                'description': 'dropped duplicate rows by srnumber',
                'rows': rows.rowcount
            })

        def switchPrimaryKey(table, report):
            exec_sql(f"""
                ALTER TABLE {table} DROP COLUMN id;
                ALTER TABLE {table} ADD PRIMARY KEY (srnumber);
            """)

            report.append({
                'description': 'switched primary key column to srnumber',
                'rows': 'N/A'
            })

        def removeInvalidClosedDates(table, report):
            result = exec_sql(f"""
                UPDATE {table}
                SET closeddate = NULL
                WHERE closeddate::timestamp < createddate::timestamp;
            """)

            report.append({
                'description': 'removed invalid closed dates',
                'rowsAffected': result.rowcount
            })

        log('\nCleaning ingest table.')
        table = Ingest.__tablename__
        report = []

        dropDuplicates(table, report)
        switchPrimaryKey(table, report)
        removeInvalidClosedDates(table, report)

        return report

    async def populateDatabase(self,
                               years=range(2015, 2021),
                               limit=2000000,
                               querySize=50000):
        log('\nPopulating database for years: {}'.format(list(years)))
        timer = Timer()

        self.resetDatabase()

        insertReport = []
        for year in years:
            inserts = self.ingestYear(year, limit, querySize)
            insertReport.append(inserts)

        cleanReport = self.cleanTable()

        minutes = timer.end()
        log('\nDone with ingestion after {} minutes.\n'.format(minutes))

        report = {
            'insertion': insertReport,
            'cleaning': cleanReport,
            'totalMinutesElapsed': minutes
        }
        log(report)
        return report
