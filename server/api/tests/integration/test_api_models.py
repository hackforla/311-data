
def test_index(client):
    url = "/"
    response = client.get(url)
    assert response.status_code == 200
    assert response.json()["message"] == "Hello, new index!"


def test_councils(client):
    url = "/councils"
    response = client.get(url)
    assert response.status_code == 200
    assert len(response.json()) == 99


def test_councils_types_stats(client):
    url = "/councils/types/stats"
    response = client.get(url)
    assert response.status_code == 200
    assert len(response.json()) == 758


def test_council(client):
    url = "/councils/1"
    response = client.get(url)
    assert response.status_code == 200
    assert response.json()["councilName"] == "Arleta"


def test_council_open_counts(client):
    url = "/councils/1/counts/open/types"
    response = client.get(url)
    assert response.status_code == 200
    assert len(response.json()) == 1


def test_council_types_stats(client):
    url = "/councils/1/types/stats"
    response = client.get(url)
    assert response.status_code == 200
    assert len(response.json()) == 9


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
    assert response.json()["typeName"] == "Graffiti"


def test_agencies(client):
    url = "/agencies"
    response = client.get(url)
    assert response.status_code == 200
    assert len(response.json()) == 12


def test_agency(client):
    url = "/agencies/1"
    response = client.get(url)
    assert response.status_code == 200
    assert response.json()["agency_name"] == "Street Lighting Bureau"


def test_sources(client):
    url = "/sources"
    response = client.get(url)
    assert response.status_code == 200
    assert len(response.json()) == 18


def test_source(client):
    url = "/sources/1"
    response = client.get(url)
    assert response.status_code == 200
    assert response.json()["source_name"] == "City Attorney"
