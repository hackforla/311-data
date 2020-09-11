
def test_map_clusters(client):
    # post old style filters (i.e. text request types)
    url = "/map/clusters"
    response = client.post(
        url,
        json={
            "startDate": "01/01/2020",
            "endDate": "08/27/2020",
            "ncList": [
                52,
                46,
                128,
                54,
                104,
                76,
                97,
                121,
                55
            ],
            "requestTypes": [
                "Dead Animal Removal",
                "Homeless Encampment",
                "Single Streetlight Issue",
                "Multiple Streetlight Issue",
                "Feedback"
            ],
            "zoom": 13,
            "bounds": {
                "north": 34.0731374116421,
                "east": -118.18010330200195,
                "south": 33.97582290387967,
                "west": -118.41201782226564
            }
        }
    )
    assert response.status_code == 200
    assert len(response.json()) == 11


def test_map_heat(client):
    # post old style filters (i.e. text request types)
    url = "/map/heat"
    response = client.post(
        url,
        json={
            "startDate": "01/01/2020",
            "endDate": "08/27/2020",
            "ncList": [
                52,
                46,
                128,
                54,
                104,
                76,
                97,
                121,
                55
            ],
            "requestTypes": [
                "Dead Animal Removal",
                "Homeless Encampment",
                "Single Streetlight Issue",
                "Multiple Streetlight Issue",
                "Feedback"
            ]
        }
    )
    assert response.status_code == 200
    assert len(response.json()) == 3582
