import requests

def test_get_api_quizzes_with_valid_authentication():
    base_url = "http://localhost:5000"
    endpoint = "/api/v1/quiz/"
    url = f"{base_url}{endpoint}"
    token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NzYxODMzMTksImlhdCI6MTc3NjE0MDExOSwidXNlcklEIjoiZjUxNzg0ZTEtMjY3Ni00YTgzLWE5NzgtYTZlZTFjMDYwN2U2In0.LpWpZKv3OKJ0kUBz9LxJVZraiDH1WvvL2kcu-5x4oyM"
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/json"
    }

    try:
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        assert False, f"Request failed: {e}"

    assert response.status_code == 200, f"Expected status code 200 but got {response.status_code}"
    try:
        response_json = response.json()
    except ValueError:
        assert False, "Response is not valid JSON"

    assert isinstance(response_json, dict), "Expected response to be a JSON object"
    assert "status" in response_json, "Response JSON missing 'status' field"
    assert response_json["status"] == "success", f"Expected status='success' but got {response_json['status']}"
    assert "data" in response_json, "Response JSON missing 'data' field"
    assert isinstance(response_json["data"], list), "Expected 'data' field to be a list of quizzes"


test_get_api_quizzes_with_valid_authentication()
