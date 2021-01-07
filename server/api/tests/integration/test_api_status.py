
def test_api_status(client):
    url = "/status/api"
    response = client.get(url)
    assert response.status_code == 200
    assert response.json()["lastPulledUTC"] > '2020-01-01'


def test_cache_status(client):
    url = "/status/cache"
    response = client.get(url)
    assert response.status_code == 200
    # check that redis has keys
    assert "councils:dict" in response.json()
    assert "regions:dict" in response.json()
    assert "types:dict" in response.json()


def test_redis_status(client):
    url = "/status/redis"
    response = client.get(url)
    assert response.status_code == 200
    # check that redis has keys
    assert len(response.json()["keyspace"]["db0"]["keys"]) > 0
    # check that at least 1 client is connected
    assert len(response.json()["clients"]["connected_clients"]) > 0


def test_database_status(client):
    url = "/status/db"
    response = client.get(url)
    assert response.status_code == 200
    assert response.json()["postgres_version"] is not None
    assert response.json()["alembic_version"] == "8f2ffbc5c2e8"


def test_log_status(client):
    url = "/status/log"
    response = client.get(url)
    assert response.status_code == 200
    assert len(response.json()) > 0
