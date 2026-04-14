import requests

def test_post_api_auth_login_with_valid_credentials():
    url = "http://localhost:5000/api/auth/login"
    headers = {
        "Content-Type": "application/json"
    }
    # Payload must include credentials (e.g., email and password) for login
    payload = {
        "email": "test@example.com",
        "password": "ValidPassword123"
    }

    try:
        response = requests.post(url, headers=headers, json=payload, timeout=30)
    except requests.RequestException as e:
        assert False, f"Request failed: {e}"

    assert response.status_code == 200, f"Expected status 200 but got {response.status_code}"
    try:
        json_response = response.json()
    except ValueError:
        assert False, "Response is not valid JSON"

    # The response should contain a JWT token; common keys to check
    token = None
    for key in ["token", "accessToken", "jwt"]:
        if key in json_response and isinstance(json_response[key], str) and json_response[key]:
            token = json_response[key]
            break
    assert token is not None, "JWT token not found in response"

test_post_api_auth_login_with_valid_credentials()