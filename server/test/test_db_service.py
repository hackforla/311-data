from src.services.dataService import DataService


def test_serviceExists():
    # Arrange
    # Act
    data_worker = DataService()
    # Assert
    assert isinstance(data_worker, DataService)


def test_emptyQuery():
    # Arrange
    queryItems = []
    data_worker = DataService()
    # Act
    result = data_worker.query(queryItems)
    # Assert
    assert result['Error'] is not None


def test_nullQuery():
    # Arrange
    queryItems = None
    data_worker = DataService()
    # Act
    result = data_worker.query(queryItems)
    # Assert
    assert result['Error'] is not None
