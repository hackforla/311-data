
def test_api_report(client):
    url = "/reports?filter=created_date>=2020-01-01"
    response = client.get(url)
    assert response.status_code == 200
    assert len(response.json()) == 30


def test_api_report_type_name(client):
    url = "/reports?filter=created_date>=2020-01-01&field=type_name"
    response = client.get(url)
    assert response.status_code == 200
    assert len(response.json()) == 10


def test_api_report_council_name(client):
    url = "/reports?filter=created_date>=2020-01-01&field=council_name"
    response = client.get(url)
    assert response.status_code == 200
    assert len(response.json()) == 99
