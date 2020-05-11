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
    filters = None
    data_worker = DataService()
    # Act
    result = data_worker.query(queryItems, filters)
    # Assert
    assert result['Error'] is not None


def test_nullQuery():
    # Arrange
    queryItems = None
    filters = None
    data_worker = DataService()
    # Act
    result = data_worker.query(queryItems, filters)
    # Assert
    assert result['Error'] is not None
