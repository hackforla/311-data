from src.services.comparisonService import ComparisonService


def test_serviceExists():
    # Arrange
    testString = 'result'
    print(testString)

    # Act
    comp_worker = ComparisonService()
    print(comp_worker)

    # Assert
    assert True
