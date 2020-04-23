from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.sql import text
import time
import json
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
        dbString = config['Database']['DB_CONNECTION_STRING']

        self.engine = create_engine(dbString)
        self.session = sessionmaker(bind=self.engine)()
        self.socrata = SocrataClient(config)

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
                'rowsAffected': rows.rowcount
            })

        def switchPrimaryKey(table, report):
            exec_sql(f"""
                ALTER TABLE {table} DROP COLUMN id;
                ALTER TABLE {table} ADD PRIMARY KEY (srnumber);
            """)

            report.append({
                'description': 'switched primary key column to srnumber',
                'rowsAffected': 'N/A'
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

        def setDaysToClose(table, report):
            result = exec_sql(f"""
              UPDATE {table}
              SET _daystoclose = EXTRACT (
                  EPOCH FROM
                  (closeddate::timestamp - createddate::timestamp) /
                  (60 * 60 * 24)
              );
            """)

            report.append({
              'description': 'set _daystoclose column',
              'rowsAffected': result.rowcount
            })

        def fixNorthWestwood(table, report):
            result = exec_sql(f"""
              UPDATE {table}
              SET nc = 127
              WHERE nc = 0 AND ncname = 'NORTH WESTWOOD NC'
            """)

            report.append({
              'description': 'fix nc code for North Westwood NC',
              'rowsAffected': result.rowcount
            })

        def fixHistoricCulturalNorth(table, report):
            result = exec_sql(f"""
              UPDATE {table}
              SET nc = 128
              WHERE nc = 0 AND ncname = 'HISTORIC CULTURAL NORTH NC'
            """)

            report.append({
              'description': 'fix nc code for Historic Cultural North NC',
              'rowsAffected': result.rowcount
            })

        log('\nCleaning ingest table.')
        table = Ingest.__tablename__
        report = []

        dropDuplicates(table, report)
        switchPrimaryKey(table, report)
        removeInvalidClosedDates(table, report)
        setDaysToClose(table, report)
        fixNorthWestwood(table, report)
        fixHistoricCulturalNorth(table, report)

        return report

    async def populateDatabase(self, years=[], limit=None, querySize=None):
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
        log(json.dumps(report, indent=2))
        return report
