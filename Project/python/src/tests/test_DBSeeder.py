import pytest

from ..utils import DBSeeder

def test_init():
    sut = DBSeeder.DBSeeder(connection_string="Test fake connection string")
