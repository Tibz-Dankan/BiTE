import requests
import time
import uuid

BASE_URL = "http://localhost:5000"

def test_get_user_analytics():
    timeout = 30
    signup_url = f"{BASE_URL}/api/v1/user/auth/signup"
    signin_url = f"{BASE_URL}/api/v1/user/auth/signin"
    analytics_url = f"{BASE_URL}/api/v1/analytics/user"

    # Step 1: Sign up a fresh user with unique email
    timestamp = int(time.time() * 1000)
    unique_email = f"testuser_{timestamp}@test.com"
    password = "TestPassword123!"
    signup_payload = {
        "name": "Test User",
        "email": unique_email,
        "password": password,
        "agreedTermsOfService": True
    }
    try:
        signup_resp = requests.post(signup_url, json=signup_payload, timeout=timeout)
    except Exception as e:
        assert False, f"Signup request failed: {e}"

    assert signup_resp.status_code == 201, f"Expected 201 on signup but got {signup_resp.status_code}"
    signup_json = signup_resp.json()
    assert "accessToken" in signup_json, "accessToken missing in signup response"
    assert "refreshToken" in signup_json, "refreshToken missing in signup response"
    assert "user" in signup_json and "id" in signup_json["user"], "User ID missing in signup response"
    user_id = signup_json["user"]["id"]

    # Step 2: Sign in with same credentials to get access token (though signup returns accessToken, follow instructions)
    signin_payload = {
        "email": unique_email,
        "password": password
    }
    try:
        signin_resp = requests.post(signin_url, json=signin_payload, timeout=timeout)
    except Exception as e:
        assert False, f"Signin request failed: {e}"

    assert signin_resp.status_code == 200, f"Expected 200 on signin but got {signin_resp.status_code}"
    signin_json = signin_resp.json()
    assert "accessToken" in signin_json, "accessToken missing in signin response"
    access_token = signin_json["accessToken"]

    # Step 3: Call GET /api/v1/analytics/user with Bearer token and userID query param
    headers = {
        "Authorization": f"Bearer {access_token}"
    }
    params = {
        "userID": user_id
    }
    try:
        analytics_resp = requests.get(analytics_url, headers=headers, params=params, timeout=timeout)
    except Exception as e:
        assert False, f"Get user analytics request failed: {e}"

    # Step 4: Validate response
    assert analytics_resp.status_code == 200, f"Expected 200 status code but got {analytics_resp.status_code}"
    analytics_json = analytics_resp.json()
    # Expect a user analytics object - check that it is a dict with at least some content
    assert isinstance(analytics_json, dict), "User analytics response is not a JSON object"
    assert len(analytics_json) > 0, "User analytics response is empty"

test_get_user_analytics()