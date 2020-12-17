
def test_service_requests(client):
    url = "/requests"
    response = client.get(url)
    assert response.status_code == 200
    assert len(response.json()) == 100


def test_service_request(client):
    url = "/requests/1"
    response = client.get(url)
    assert response.status_code == 200
    assert response.json()["srnumber"] == "1-1523590121"
    assert response.json()["created_date"] == "2020-01-01"
    assert response.json()["closed_date"] == "2020-01-02"
    assert response.json()["type_id"] == 8
    assert response.json()["council_id"] == 19
    assert response.json()["region_id"] == 3
    assert response.json()["address"] == "16815 W VANOWEN ST, 91406"
    assert response.json()["latitude"] == 34.19402846
    assert response.json()["longitude"] == -118.4994716


def test_open_service_request_pins(client):
    url = "/requests/pins/open"
    response = client.get(url)
    assert response.status_code == 200
    assert len(response.json()) == 43


def test_open_counts_by_type(client):
    url = "/requests/counts/open/types"
    response = client.get(url)
    assert response.status_code == 200
    assert len(response.json()) == 6


def test_service_request_pins(client):
    url = "/requests/pins"
    response = client.post(
        url,
        json={
            "startDate": "2020-01-01",
            "endDate": "2020-01-02",
            "ncList": [
                29
            ],
            "requestTypes": [
                6
            ]
        })
    assert response.status_code == 200
    assert len(response.json()) == 36


def test_service_request_points(client):
    url = "/requests/points"
    response = client.post(
        url,
        json={
            "startDate": "2020-01-01",
            "endDate": "2020-01-02",
            "ncList": [
                29
            ],
            "requestTypes": [
                6
            ]
        })
    assert response.status_code == 200
    assert len(response.json()) == 36
