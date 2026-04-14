import requests
import time

BASE_URL = "http://localhost:5000"

def test_refresh_token_signin_with_invalid_token():
    signup_url = f"{BASE_URL}/api/v1/user/auth/signup"
    rt_signin_url = f"{BASE_URL}/api/v1/user/auth/rt-signin"
    headers = {"Content-Type": "application/json"}
    
    # Step 1: Sign up a fresh user to get valid userID and refreshToken
    unique_email = f"testuser_{int(time.time()*1000)}@test.com"
    signup_payload = {
        "name": "Test User",
        "email": unique_email,
        "password": "StrongPassword123!",
        "agreedTermsOfService": True
    }
    signup_resp = requests.post(signup_url, json=signup_payload, headers=headers, timeout=30)
    assert signup_resp.status_code == 201, f"Signup failed with status {signup_resp.status_code}: {signup_resp.text}"
    signup_data = signup_resp.json()
    user_id = signup_data.get("user", {}).get("id")
    assert user_id, "User ID missing in signup response"
    
    # Use an invalid/expired refresh token string (random or malformed)
    invalid_refresh_token = "invalid_refresh_token_xyz123"

    rt_signin_payload = {
        "userID": user_id,
        "refreshToken": invalid_refresh_token
    }
    rt_resp = requests.post(rt_signin_url, json=rt_signin_payload, headers=headers, timeout=30)
    
    # Expect 400 status code
    assert rt_resp.status_code == 400, f"Expected 400 for invalid refresh token, got {rt_resp.status_code}"
    rt_resp_json = rt_resp.json()
    
    # Check for error message about refresh token missing/expired/invalid in response text or error field
    error_msgs = [
        "refresh token missing",
        "refresh token expired",
        "refresh token invalid",
        "refresh token",
    ]
    error_msg_found = False
    lower_text = str(rt_resp_json).lower()
    for msg in error_msgs:
        if msg in lower_text:
            error_msg_found = True
            break
    assert error_msg_found, f"Expected error message about refresh token missing/expired/invalid, got: {rt_resp_json}"
    

test_refresh_token_signin_with_invalid_token()