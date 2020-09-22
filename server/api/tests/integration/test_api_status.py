
def test_api_status(client):
    url = "/status/api"
    response = client.get(url)
    assert response.status_code == 200
    assert response.json()["lastPulled"] > '2020-01-01'


def test_cache_status(client):
    url = "/status/cache"
    response = client.get(url)
    assert response.status_code == 200
    assert len(response.json()["types"]) == 12
    assert len(response.json()["regions"]) == 12
    assert len(response.json()["councils"]) == 99


def test_database_status(client):
    url = "/status/db"
    response = client.get(url)
    assert response.status_code == 200
    assert response.json()["postgres_version"] is not None
    assert response.json()["alembic_version"] == "8f2ffbc5c2e8"
