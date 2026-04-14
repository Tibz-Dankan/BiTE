import requests
import time
import uuid

BASE_URL = "http://localhost:5000"
TIMEOUT = 30

def test_refresh_token_signin_with_valid_token():
    signup_url = f"{BASE_URL}/api/v1/user/auth/signup"
    rt_signin_url = f"{BASE_URL}/api/v1/user/auth/rt-signin"

    # Prepare unique email using timestamp and uuid
    unique_email = f"testuser_{int(time.time())}_{uuid.uuid4().hex[:8]}@test.com"
    signup_payload = {
        "name": "Test User",
        "email": unique_email,
        "password": "StrongPass!234",
        "agreedTermsOfService": True
    }

    # Step 1: Sign up new user to get valid refresh token and userID
    try:
        signup_resp = requests.post(signup_url, json=signup_payload, timeout=TIMEOUT)
        assert signup_resp.status_code == 201, f"Signup failed with status {signup_resp.status_code}"
        signup_data = signup_resp.json()

        assert "refreshToken" in signup_data and signup_data["refreshToken"], "Missing refreshToken in signup response"
        assert "accessToken" in signup_data and signup_data["accessToken"], "Missing accessToken in signup response"
        assert "user" in signup_data and "id" in signup_data["user"], "Missing user ID in signup response"

        user_id = signup_data["user"]["id"]
        refresh_token = signup_data["refreshToken"]

        # Step 2: Use valid refresh token to get new tokens
        rt_payload = {
            "userID": user_id,
            "refreshToken": refresh_token
        }

        rt_resp = requests.post(rt_signin_url, json=rt_payload, timeout=TIMEOUT)
        assert rt_resp.status_code == 200, f"Refresh token signin failed with status {rt_resp.status_code}"
        rt_data = rt_resp.json()

        # Validate presence of new accessToken, refreshToken
        assert "accessToken" in rt_data and rt_data["accessToken"], "Missing accessToken in refresh token signin response"
        assert "refreshToken" in rt_data and rt_data["refreshToken"], "Missing refreshToken in refresh token signin response"
        # Optionally check user object is present and status success if applicable
        assert "user" in rt_data and "id" in rt_data["user"], "Missing user object or id in refresh token signin response"

    except requests.exceptions.RequestException as e:
        assert False, f"Request failed: {e}"

test_refresh_token_signin_with_valid_token()