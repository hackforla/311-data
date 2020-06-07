from src.services.visualizationsService import VisualizationsService


def test_serviceExists():
    # Arrange
    testString = 'result'
    print(testString)

    # Act
    vis_worker = VisualizationsService()
    print(vis_worker)

    # Assert
    assert True
