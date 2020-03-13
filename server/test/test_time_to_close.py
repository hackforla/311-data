from src.services.time_to_close import time_to_close

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
    ttc_worker = time_to_close(TESTCONFIG)
    print(ttc_worker)

    # Assert
    assert True
