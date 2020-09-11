
def test_api_status(client):
    url = "/status/api"
    response = client.get(url)
    assert response.status_code == 200
    assert response.json()["lastPulled"] > '2020-01-01'


def test_cache_status(client):
    url = "/status/cache"
    response = client.get(url)
    assert response.status_code == 200
    assert len(response.json()["types_dict"]) == 12
