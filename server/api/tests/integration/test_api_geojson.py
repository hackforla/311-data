
def test_api_geojson(client):
    url = "/geojson"
    response = client.get(url)
    assert response.status_code == 200
    assert response.json()["type"] == "FeatureCollection"
    assert len(response.json()["features"]) == 99
