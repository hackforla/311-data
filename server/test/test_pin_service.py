from src.services.PinService import PinService

TESTCONFIG = {
    "Database": {
        "DB_CONNECTION_STRING": "postgresql://testingString/postgresql"
    }
}


def test_serviceExists():
    # Arrange
    # Act
    pin_worker = PinService(TESTCONFIG)
    # Assert
    assert isinstance(pin_worker, PinService)


# def test_emptyQuery():
#     # Arrange
#     queryItems = []
#     data_worker = DataService(TESTCONFIG)
#     # Act
#     result = data_worker.query(queryItems)
#     # Assert
#     assert result['Error'] is not None
#
#
# def test_nullQuery():
#     # Arrange
#     queryItems = None
#     data_worker = DataService(TESTCONFIG)
#     # Act
#     result = data_worker.query(queryItems)
#     # Assert
#     assert result['Error'] is not None
