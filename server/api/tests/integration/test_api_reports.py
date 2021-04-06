
def test_api_report(client):
    url = "/reports?filter=created_date>=2020-01-01"
    response = client.get(url)
    assert response.status_code == 200
    assert len(response.json()) == 32


def test_api_report_type_name(client):
    url = "/reports?filter=created_date>=2020-01-01&field=type_name"
    response = client.get(url)
    assert response.status_code == 200
    assert len(response.json()) == 11


def test_api_report_council_name(client):
    url = "/reports?filter=created_date>=2020-01-01&field=council_name"
    response = client.get(url)
    assert response.status_code == 200
    assert len(response.json()) == 100


def test_csv_export(client):
    url = "/reports/export/2020/service_requests.csv"
    response = client.get(url)
    assert response.status_code == 200


def test_gzip_export(client):
    url = "/reports/export/2020/service_requests.csv.gz"
    response = client.get(url)
    assert response.status_code == 200
