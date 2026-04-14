import requests
import time

BASE_URL = "http://localhost:5000"
TIMEOUT = 30

def test_signin_with_valid_credentials():
    # Step 1: Sign up a unique new user to ensure valid credentials exist
    signup_url = f"{BASE_URL}/api/v1/user/auth/signup"
    timestamp = int(time.time() * 1000)
    test_email = f"testuser_{timestamp}@test.com"
    signup_payload = {
        "name": "Test User",
        "email": test_email,
        "password": "TestPass123!",
        "agreedTermsOfService": True
    }

    try:
        signup_resp = requests.post(signup_url, json=signup_payload, timeout=TIMEOUT)
        assert signup_resp.status_code == 201, f"Signup failed with code {signup_resp.status_code} and response {signup_resp.text}"
        signup_data = signup_resp.json()
        assert "accessToken" in signup_data and "refreshToken" in signup_data and "user" in signup_data, "Signup response missing tokens or user"
        # Extract credentials for signin
        signin_email = test_email
        signin_password = signup_payload["password"]

        # Step 2: Sign in with the valid credentials
        signin_url = f"{BASE_URL}/api/v1/user/auth/signin"
        signin_payload = {
            "email": signin_email,
            "password": signin_password
        }

        signin_resp = requests.post(signin_url, json=signin_payload, timeout=TIMEOUT)
        assert signin_resp.status_code == 200, f"Signin failed with code {signin_resp.status_code} and response {signin_resp.text}"
        signin_data = signin_resp.json()

        # Validate response content
        assert isinstance(signin_data, dict), "Signin response not a JSON object"
        assert signin_data.get("status") == "success", f"Signin status not success: {signin_data.get('status')}"
        assert "accessToken" in signin_data, "accessToken missing in signin response"
        assert "refreshToken" in signin_data, "refreshToken missing in signin response"
        assert "user" in signin_data, "user profile missing in signin response"

    finally:
        # Cleanup is not needed as user cleanup is not specified for the signup
        pass

test_signin_with_valid_credentials()