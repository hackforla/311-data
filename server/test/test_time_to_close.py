from src.services.time_to_close import time_to_close


def test_serviceExists():
    # Arrange
    testString = 'result'
    print(testString)

    # Act
    ttc_worker = time_to_close()
    print(ttc_worker)

    # Assert
    assert True
