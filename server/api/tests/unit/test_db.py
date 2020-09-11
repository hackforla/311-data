from datetime import datetime
import db


def test_version():
    version = db.version()
    assert isinstance(version, int)


def test_last_updated():
    last_updated = db.info.last_updated()
    assert isinstance(last_updated, datetime)


def test_rows():
    rows = db.info.rows()
    assert isinstance(rows, dict)
