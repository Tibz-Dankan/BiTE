import requests
import time
import uuid

BASE_URL = "http://localhost:5000"
TIMEOUT = 30

def test_signup_with_valid_payload():
    url = f"{BASE_URL}/api/v1/user/auth/signup"
    unique_email = f"testuser_{int(time.time()*1000)}@test.com"
    payload = {
        "name": "Test User",
        "email": unique_email,
        "password": "StrongPassw0rd!",
        "agreedTermsOfService": True
    }
    headers = {
        "Content-Type": "application/json"
    }
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=TIMEOUT)
        assert response.status_code == 201, f"Expected status 201, got {response.status_code}"
        data = response.json()
        # Validate presence of accessToken, refreshToken, and user object
        assert "accessToken" in data and isinstance(data["accessToken"], str) and data["accessToken"]
        assert "refreshToken" in data and isinstance(data["refreshToken"], str) and data["refreshToken"]
        assert "user" in data and isinstance(data["user"], dict)
        user = data["user"]
        # Check essential fields in user object
        assert "id" in user and isinstance(user["id"], str) and user["id"]
        assert "name" in user and user["name"] == payload["name"]
        assert "email" in user and user["email"] == payload["email"]
        # The agreedTermsOfService should be true (some APIs may reflect this)
        if "agreedTermsOfService" in user:
            assert user["agreedTermsOfService"] is True
    except requests.RequestException as e:
        assert False, f"Request failed: {e}"

test_signup_with_valid_payload()