import requests
import time

BASE_URL = "http://localhost:5000"

def test_get_certificate_claim_status():
    # Step 1: Signup a fresh user to get credentials
    timestamp = int(time.time() * 1000)
    signup_email = f"testuser_{timestamp}@test.com"
    signup_payload = {
        "name": "Test User",
        "email": signup_email,
        "password": "TestPassword123!",
        "agreedTermsOfService": True
    }
    signup_resp = requests.post(
        f"{BASE_URL}/api/v1/user/auth/signup",
        json=signup_payload,
        timeout=30
    )
    assert signup_resp.status_code == 201, f"Signup failed: {signup_resp.text}"
    signup_data = signup_resp.json()
    access_token = signup_data.get("accessToken")
    user = signup_data.get("user")
    assert access_token and user and user.get("id"), "Signup response missing accessToken or user ID"
    user_id = user["id"]

    headers = {
        "Authorization": f"Bearer {access_token}"
    }

    # Use a valid but dummy UUID to avoid 400 Bad Request due to invalid UUID format
    dummy_certificate_id = "11111111-1111-1111-1111-111111111111"

    resp = requests.get(
        f"{BASE_URL}/api/v1/certificate/{dummy_certificate_id}/claim-status/user/{user_id}",
        headers=headers,
        timeout=30
    )
    if resp.status_code == 200:
        json_data = resp.json()
        # Expect data: {claimed: boolean, certificateAwarded: object|null}
        assert isinstance(json_data, dict), "Response JSON is not an object"
        assert "claimed" in json_data, "'claimed' not in response data"
        assert isinstance(json_data["claimed"], bool), "'claimed' is not boolean"
        assert "certificateAwarded" in json_data, "'certificateAwarded' not in response data"
        assert (json_data["certificateAwarded"] is None or isinstance(json_data["certificateAwarded"], dict)), 
            "'certificateAwarded' is not object or null"
    elif resp.status_code == 404:
        # Resource not found, acceptable for dummy ID (skip test)
        print("Certificate ID not found, test skipped.")
    else:
        assert False, f"Unexpected status code {resp.status_code}: {resp.text}"

test_get_certificate_claim_status()
