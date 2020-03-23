from src.services.timeToCloseService import TimeToCloseService

TESTCONFIG = {
    "Database": {
        "DB_CONNECTION_STRING": "postgresql://testingString/postgresql"
    }
}


def test_serviceExists():
    # Arrange
    testString = 'result'
    print(testString)

    # Act
    ttc_worker = TimeToCloseService(TESTCONFIG)
    print(ttc_worker)

    # Assert
    assert True
