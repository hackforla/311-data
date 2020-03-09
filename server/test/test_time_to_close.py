from src.services.Time_to_close import Time_to_close


def test_serviceExists():
    # Arrange
    testString = 'result'
    print(testString)

    # Act
    ttc_worker = Time_to_close()
    print(ttc_worker)

    # Assert
    assert True
