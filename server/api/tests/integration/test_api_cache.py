
"""
Making this the first call in order to reset the cache before other tests run. Not
an issue during CI, but can be a problem when running locally. Need to think about
disabling cache altogether for tests.
"""


def test_cache_reset(client):
    url = "/status/reset-cache"
    response = client.post(url)
    assert response.status_code == 200
