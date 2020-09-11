
def test_api_status(client):
    url = "/status/api"
    response = client.get(url)
    assert response.json()["gitSha"] == 'DEVELOPMENT'


def test_cache_status(client):
    url = "/status/cache"
    response = client.get(url)
    assert len(response.json()["types_dict"]) == 12
