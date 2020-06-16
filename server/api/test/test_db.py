import db
from datetime import datetime


class TestDB:
    def test_version(self):
        version = db.version()
        assert isinstance(version, int)

    def test_last_updated(self):
        last_updated = db.info.last_updated()
        assert isinstance(last_updated, datetime)

    def test_rows(self):
        rows = db.info.rows()
        assert isinstance(rows, dict)
