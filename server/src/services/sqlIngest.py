from utils.database import db
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
        self.session = db.Session()
        self.socrata = SocrataClient(config)

    def __del__(self):
        self.session.close()

    def resetDatabase(self):
        log('\nResetting database.')
        db.exec_sql(f"""
            DROP TABLE IF EXISTS {Ingest.__tablename__} CASCADE
        """)
        Base.metadata.create_all(db.engine)

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
        def dropDuplicates(table, report):
            rows = db.exec_sql(f"""
                DELETE FROM {table} a USING {table} b
                WHERE a.id < b.id AND a.srnumber = b.srnumber;
            """)

            report.append({
                'description': 'dropped duplicate rows by srnumber',
                'rowsAffected': rows.rowcount
            })

        def switchPrimaryKey(table, report):
            db.exec_sql(f"""
                ALTER TABLE {table} DROP COLUMN id;
                ALTER TABLE {table} ADD PRIMARY KEY (srnumber);
            """)

            report.append({
                'description': 'switched primary key column to srnumber',
                'rowsAffected': 'N/A'
            })

        def removeInvalidClosedDates(table, report):
            result = db.exec_sql(f"""
                UPDATE {table}
                SET closeddate = NULL
                WHERE closeddate::timestamp < createddate::timestamp;
            """)

            report.append({
                'description': 'removed invalid closed dates',
                'rowsAffected': result.rowcount
            })

        def setDaysToClose(table, report):
            result = db.exec_sql(f"""
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
            result = db.exec_sql(f"""
              UPDATE {table}
              SET nc = 127
              WHERE nc = 0 AND ncname = 'NORTH WESTWOOD NC'
            """)

            report.append({
              'description': 'fix nc code for North Westwood NC',
              'rowsAffected': result.rowcount
            })

        def fixHistoricCulturalNorth(table, report):
            result = db.exec_sql(f"""
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

    def createViews(self):
        def createMapView(table, report):
            rows = db.exec_sql(f"""
                CREATE MATERIALIZED VIEW map AS
                    SELECT
                        srnumber,
                        requesttype,
                        nc,
                        latitude,
                        longitude,
                        createddate
                    FROM {table}
                    WHERE
                        latitude IS NOT NULL AND
                        longitude IS NOT NULL
                WITH DATA;
            """)

            db.exec_sql("""
                CREATE INDEX map_nc_index ON map(nc);
                CREATE INDEX map_requesttype_index ON map(requesttype);
                CREATE INDEX map_createddate_index ON map(createddate);
            """)

            report.append({
                'description': 'create map view',
                'rowsAffected': rows.rowcount
            })

        def createVisView(table, report):
            rows = db.exec_sql(f"""
                CREATE MATERIALIZED VIEW vis AS
                    SELECT
                        requesttype,
                        requestsource,
                        nc,
                        cd,
                        createddate,
                        _daystoclose
                    FROM {table}
                WITH DATA;
            """)

            db.exec_sql("""
                CREATE INDEX vis_nc_index ON vis(nc);
                CREATE INDEX vis_cd_index ON vis(cd);
                CREATE INDEX vis_requesttype_index ON vis(requesttype);
                CREATE INDEX vis_createddate_index ON vis(createddate);
            """)

            report.append({
                'description': 'create vis view',
                'rowsAffected': rows.rowcount
            })

        log('\nCreating views on ingest table.')
        table = Ingest.__tablename__
        report = []

        createMapView(table, report)
        createVisView(table, report)

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
        viewsReport = self.createViews()

        minutes = timer.end()
        log('\nDone with ingestion after {} minutes.\n'.format(minutes))

        report = {
            'insertion': insertReport,
            'cleaning': cleanReport,
            'views': viewsReport,
            'totalMinutesElapsed': minutes
        }
        log(json.dumps(report, indent=2))
        return report
