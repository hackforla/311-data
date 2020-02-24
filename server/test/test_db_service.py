from src.services.dataService import DataService

TESTCONFIG = {
    "Database": {
        "DB_CONNECTION_STRING": "postgresql://testingString/postgresql"
    }
}


def test_serviceExists():
    # Arrange
    # Act
    data_worker = DataService(TESTCONFIG)
    # Assert
    assert isinstance(data_worker, DataService)


def test_emptyQuery():
    # Arrange
    queryItems = []
    data_worker = DataService(TESTCONFIG)
    # Act
    result = data_worker.query(queryItems)
    # Assert
    assert result['Error'] is not None


def test_nullQuery():
    # Arrange
    queryItems = None
    data_worker = DataService(TESTCONFIG)
    # Act
    result = data_worker.query(queryItems)
    # Assert
    assert result['Error'] is not None
