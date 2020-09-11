
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
    assert len(response.json()) == 6


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
    assert len(response.json()) == 114
