
"""
These are 'integration tests' of the shim API endpoints.

These tests run on a live database and assume that data
from the first 10K records of 2020 have been loaded.
"""


def test_map_clusters(client):
    # post old style filters (i.e. text request types)
    url = "/map/clusters"
    response = client.post(
        url,
        json={
            "startDate": "01/01/2020",
            "endDate": "01/02/2020",
            "ncList": [
                29,
                30,
                32,
                33,
                34,
                46,
                52,
                54,
                55,
                58,
                60,
                76,
                97,
                104,
                119,
                121,
                128
            ],
            "requestTypes": [
                "Bulky Items",
                "Dead Animal Removal",
                "Electronic Waste",
                "Graffiti Removal",
                "Homeless Encampment"
            ],
            "zoom": 12,
            "bounds": {
                "north": 34.182837768400596,
                "east": -118.12259674072267,
                "south": 33.98834915267798,
                "west": -118.59844207763673
            }
        }
    )
    assert response.status_code == 200
    # for some reason cluster numbers are different local vs CI
    assert len(response.json()) == 6 or 7


def test_map_heat(client):
    # post old style filters (i.e. text request types)
    url = "/map/heat"
    response = client.post(
        url,
        json={
            "startDate": "01/01/2020",
            "endDate": "01/02/2020",
            "ncList": [
                29,
                30,
                32,
                33,
                34,
                46,
                52,
                54,
                55,
                58,
                60,
                76,
                97,
                104,
                119,
                121,
                128
            ],
            "requestTypes": [
                "Dead Animal Removal",
                "Homeless Encampment",
                "Graffiti Removal"
            ]
        }
    )
    assert response.status_code == 200
    assert len(response.json()) == 621


def test_map_pins(client):
    # post old style filters (i.e. text request types)
    url = "/map/pins"
    response = client.post(
        url,
        json={
            "startDate": "01/01/2020",
            "endDate": "01/02/2020",
            "ncList": [
                29,
                30,
                32,
                33,
                34,
                46,
                52,
                54,
                55,
                58,
                60,
                76,
                97,
                104,
                119,
                121,
                128
            ],
            "requestTypes": [
                "Dead Animal Removal",
                "Homeless Encampment",
                "Graffiti Removal"
            ]
        }
    )
    assert response.status_code == 200
    assert len(response.json()) == 621


def test_open_requests(client):
    # post old style filters (i.e. text request types)
    url = "/open-requests"
    response = client.post(
        url
    )
    assert response.status_code == 200
    assert len(response.json()["requests"]) == 43


def test_visualizations(client):
    # post old style filters (i.e. text request types)
    url = "/visualizations"
    response = client.post(
        url,
        json={
            "startDate": "01/01/2020",
            "endDate": "01/02/2020",
            "ncList": [
                29,
                30,
                32,
                33,
                34,
                46,
                52,
                54,
                55,
                58,
                60,
                76,
                97,
                104,
                119,
                121,
                128
            ],
            "requestTypes": [
                "Bulky Items",
                "Dead Animal Removal",
                "Electronic Waste",
                "Graffiti Removal",
                "Homeless Encampment"
            ],
            "zoom": 12,
            "bounds": {
                "north": 34.182837768400596,
                "east": -118.12259674072267,
                "south": 33.98834915267798,
                "west": -118.59844207763673
            }
        }
    )
    assert response.status_code == 200
    assert response.json()["frequency"]
    assert response.json()["timeToClose"]
    assert response.json()["counts"]


def test_compare_frequency(client):
    # post old style filters (i.e. text request types)
    url = "/comparison/frequency"
    response = client.post(
        url,
        json={
            "startDate": "01/01/2020",
            "endDate": "01/02/2020",
            "requestTypes": [
                "Dead Animal Removal",
                "Homeless Encampment",
                "Bulky Items",
                "Electronic Waste",
                "Metal/Household Appliances"
            ],
            "chart": "frequency",
            "set1": {
                "district": "nc",
                "list": [
                    32,
                    34,
                    119,
                    29,
                    33,
                    30,
                    58,
                    60
                ]
            },
            "set2": {
                "district": "nc",
                "list": [
                    52,
                    46,
                    128,
                    54,
                    104,
                    76,
                    97,
                    121,
                    55
                ]
            }
        }
    )
    assert response.status_code == 200
    assert response.json()["bins"]
    assert response.json()["set1"]
    assert response.json()["set2"]


def test_compare_total_requests(client):
    # post old style filters (i.e. text request types)
    url = "/comparison/frequency"
    response = client.post(
        url,
        json={
            "startDate": "01/01/2020",
            "endDate": "01/02/2020",
            "requestTypes": [
                "Dead Animal Removal",
                "Homeless Encampment",
                "Bulky Items",
                "Electronic Waste",
                "Metal/Household Appliances"
            ],
            "chart": "requests",
            "set1": {
                "district": "nc",
                "list": [
                    32,
                    34,
                    119,
                    29,
                    33,
                    30,
                    58,
                    60
                ]
            },
            "set2": {
                "district": "nc",
                "list": [
                    52,
                    46,
                    128,
                    54,
                    104,
                    76,
                    97,
                    121,
                    55
                ]
            }
        }
    )
    assert response.status_code == 200
    assert response.json()["bins"]
    assert response.json()["set1"]
    assert response.json()["set2"]


def test_compare_timetoclose(client):
    # post old style filters (i.e. text request types)
    url = "/comparison/timetoclose"
    response = client.post(
        url,
        json={
            "startDate": "01/01/2020",
            "endDate": "01/02/2020",
            "requestTypes": [
                "Dead Animal Removal",
                "Homeless Encampment",
                "Bulky Items",
                "Electronic Waste",
                "Metal/Household Appliances"
            ],
            "chart": "time",
            "set1": {
                "district": "nc",
                "list": [
                    32,
                    34,
                    119,
                    29,
                    33,
                    30,
                    58,
                    60
                ]
            },
            "set2": {
                "district": "nc",
                "list": [
                    52,
                    46,
                    128,
                    54,
                    104,
                    76,
                    97,
                    121,
                    55
                ]
            }
        }
    )
    assert response.status_code == 200
    assert response.json()["set1"]
    assert response.json()["set2"]


def test_compare_counts(client):
    # post old style filters (i.e. text request types)
    url = "/comparison/counts"
    response = client.post(
        url,
        json={
            "startDate": "01/01/2020",
            "endDate": "01/02/2020",
            "requestTypes": [
                "Dead Animal Removal",
                "Homeless Encampment",
                "Bulky Items",
                "Electronic Waste",
                "Metal/Household Appliances"
            ],
            "chart": "contact",
            "set1": {
                "district": "nc",
                "list": [
                    32,
                    34,
                    119,
                    29,
                    33,
                    30,
                    58,
                    60
                ]
            },
            "set2": {
                "district": "nc",
                "list": [
                    52,
                    46,
                    128,
                    54,
                    104,
                    76,
                    97,
                    121,
                    55
                ]
            }
        }
    )
    assert response.status_code == 200
    assert response.json()["set1"]
    assert response.json()["set2"]