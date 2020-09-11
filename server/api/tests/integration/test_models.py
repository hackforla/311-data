
def test_councils(client):
    url = "/councils"
    response = client.get(url)
    assert response.status_code == 200
    assert len(response.json()) == 99


def test_council(client):
    url = "/councils/6"
    response = client.get(url)
    assert response.status_code == 200
    assert response.json()["council_name"] == "Arleta"


def test_regions(client):
    url = "/regions"
    response = client.get(url)
    assert response.status_code == 200
    assert len(response.json()) == 12


def test_region(client):
    url = "/regions/1"
    response = client.get(url)
    assert response.status_code == 200
    assert response.json()["region_name"] == "North East Valley"


def test_types(client):
    url = "/types"
    response = client.get(url)
    assert response.status_code == 200
    assert len(response.json()) == 12


def test_type(client):
    url = "/types/1"
    response = client.get(url)
    assert response.status_code == 200
    assert response.json()["type_name"] == "Bulky Items"


def test_service_request(client):
    url = "/requests/1523590121"
    response = client.get(url)
    assert response.status_code == 200
    assert response.json()["created_date"] == "2020-01-01"
    assert response.json()["closed_date"] == "2020-01-02"
    assert response.json()["type_id"] == 7
    assert response.json()["council_id"] == 19
    assert response.json()["region_id"] == 3
    assert response.json()["address"] == "16815 W VANOWEN ST, 91406"
    assert response.json()["latitude"] == 34.19402846
    assert response.json()["longitude"] == -118.4994716
