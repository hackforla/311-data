
from lacity_data_api.services import github, email

"""
These are 'integration tests' of the shim API endpoints.

These tests run on a live database and assume that data
from the first 10K records of 2020 have been loaded.
"""


def test_map_pins(client):
    # post old style filters (i.e. text request types)
    url = "/map/pins"
    response = client.post(
        url,
        json={
            "startDate": "01/01/2020",
            "endDate": "01/02/2020",
            "ncList": [
                9,
                14,
                16,
                32,
                37,
                38,
                40,
                41,
                42,
                47,
                50,
                62,
                63,
                68,
                91,
                92,
                96
            ],
            "requestTypes": [
                "Dead Animal Removal",
                "Homeless Encampment",
                "Graffiti Removal"
            ]
        }
    )
    assert response.status_code == 200
    assert len(response.json()) == 662


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
                9,
                14,
                16,
                32,
                37,
                38,
                40,
                41,
                42,
                47,
                50,
                62,
                63,
                68,
                91,
                92,
                96
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


def test_compare_frequency_cd(client):
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
                "district": "cc",
                "list": [
                    1,
                    2
                ]
            },
            "set2": {
                "district": "cc",
                "list": [
                    3,
                    4
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


def test_compare_total_requests_cd(client):
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
                "district": "cc",
                "list": [
                    1,
                    2
                ]
            },
            "set2": {
                "district": "cc",
                "list": [
                    3,
                    4
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


def test_compare_timetoclose_cd(client):
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
                "district": "cc",
                "list": [
                    1,
                    2
                ]
            },
            "set2": {
                "district": "cc",
                "list": [
                    3,
                    4
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


def test_compare_counts_cd(client):
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
                "district": "cc",
                "list": [
                    1,
                    2
                ]
            },
            "set2": {
                "district": "cc",
                "list": [
                    3,
                    4
                ]
            }
        }
    )
    assert response.status_code == 200
    assert response.json()["set1"]
    assert response.json()["set2"]


def test_feedback(client, monkeypatch):
    # monkeypatching creating issue, adding to project, and sending email
    async def mock_create_issue(title, body):
        print(f"Mock 'create_issue' called with '{title}' and '{body}'")
        return 1, 2

    async def mock_add_issue_to_project(id):
        print(f"Mock 'add_issue_to_project' called with '{id}'")
        return 200

    async def mock_respond_to_feedback(feedback, number):
        print(f"Mock 'respond_to_feedback' called with '{feedback}' and '{number}'")
        return "message sent"

    monkeypatch.setattr(github, 'create_issue', mock_create_issue)
    monkeypatch.setattr(github, 'add_issue_to_project', mock_add_issue_to_project)
    monkeypatch.setattr(email, 'respond_to_feedback', mock_respond_to_feedback)

    url = "/feedback"
    response = client.post(
        url,
        json={
            "title": "Test Feedback Title",
            "body": "Test Feedback Body"
        }
    )

    assert response.status_code == 201
    assert response.json()["success"] is True


def test_servicerequest(client):
    url = "/servicerequest/1-1523590121"
    response = client.get(url)
    assert response.status_code == 200
    assert response.json()["requesttype"] == "Illegal Dumping Pickup"
    assert response.json()["nc"] == 19
    assert response.json()["address"] == "16815 W VANOWEN ST, 91406"
    assert response.json()["latitude"] == 34.19402846
    assert response.json()["longitude"] == -118.4994716
