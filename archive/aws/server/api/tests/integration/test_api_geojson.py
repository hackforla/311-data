
def test_api_geojson(client):
    url = "/geojson"
    response = client.get(url)
    assert response.status_code == 200
    assert response.json()["type"] == "FeatureCollection"
    assert len(response.json()["features"]) == 99


def test_api_geojson_geocode(client):
    url = "/geojson/geocode?latitude=34.195059&longitude=-118.483917"
    response = client.get(url)
    assert response.status_code == 200
    assert response.json()["council_id"] == 44


def test_api_geojson_geocode_nomatch(client):
    url = "/geojson/geocode?latitude=35.195059&longitude=-118.483917"
    response = client.get(url)
    assert response.status_code == 404
