import requests
import datetime

BASE_URL = "http://localhost:5000"

def test_post_site_visit_anonymous():
    url = f"{BASE_URL}/api/v1/sitevisit/"
    payload = {
        "page": "homepage",
        "path": "/",
        "capturedAt": datetime.datetime.utcnow().replace(microsecond=0).isoformat() + "Z"
    }
    headers = {
        "Content-Type": "application/json"
    }

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=30)
    except requests.RequestException as e:
        assert False, f"Request failed: {e}"

    assert response.status_code == 201, f"Expected status code 201, got {response.status_code}"
    try:
        data = response.json()
    except ValueError:
        assert False, "Response is not valid JSON"

    assert isinstance(data, dict), "Response JSON is not an object"
    assert 'status' in data and data['status'] == 'success', "Response status is not 'success'"
    assert 'data' in data, "Response missing 'data' field"
    sv = data['data']
    for field in ["page", "path", "capturedAt"]:
        assert field in sv, f"Response data missing expected field: {field}"
    assert sv["page"] == payload["page"], f"Expected page {payload['page']}, got {sv['page']}"
    assert sv["path"] == payload["path"], f"Expected path {payload['path']}, got {sv['path']}"
    assert sv["capturedAt"].startswith(payload["capturedAt"][:19]), f"Expected capturedAt starting with {payload['capturedAt'][:19]}, got {sv['capturedAt']}"

test_post_site_visit_anonymous()
