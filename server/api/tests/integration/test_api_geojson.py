
def test_api_geojson(client):
    url = "/geojson"
    response = client.get(url)
    assert response.status_code == 200
