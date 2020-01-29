def myFunc(param):
    return param


def test_myFunc():
    # Arrange
    testString = 'result'

    # Act
    result = myFunc(testString)

    # Assert
    assert result == testString
