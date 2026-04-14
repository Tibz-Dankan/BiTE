import requests
import time
import uuid

BASE_URL = "http://localhost:5000"
TIMEOUT = 30

def test_post_satsreward_address_duplicate():
    # Step 1: Signup new user
    timestamp = int(time.time() * 1000)
    signup_email = f"testuser_{timestamp}@test.com"
    signup_payload = {
        "name": "Test User",
        "email": signup_email,
        "password": "StrongPassword123!",
        "agreedTermsOfService": True
    }
    signup_resp = requests.post(
        f"{BASE_URL}/api/v1/user/auth/signup",
        json=signup_payload,
        timeout=TIMEOUT
    )
    assert signup_resp.status_code == 201, f"Signup failed: {signup_resp.text}"
    signup_data = signup_resp.json()
    assert "accessToken" in signup_data and "refreshToken" in signup_data and "user" in signup_data
    access_token = signup_data["accessToken"]
    user_id = signup_data["user"]["id"]
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    address = f"duplicate_test_{uuid.uuid4()}@ln.tips"
    created_address_id = None
    try:
        # Step 2: Post satsreward address first time (should succeed 201)
        payload_first = {
            "userID": user_id,
            "address": address
        }
        post_first_resp = requests.post(
            f"{BASE_URL}/api/v1/satsreward/address",
            json=payload_first,
            headers=headers,
            timeout=TIMEOUT
        )
        assert post_first_resp.status_code == 201, f"First POST satsreward/address failed: {post_first_resp.text}"
        resp_first_data = post_first_resp.json()
        assert "id" in resp_first_data or "data" in resp_first_data, "Response missing ID or data for created address"
        # Extract created ID if possible
        created_address_id = resp_first_data.get("id") or resp_first_data.get("data", {}).get("id")

        # Step 3: Post satsreward address second time with same address (expect 400 duplicate error)
        payload_second = {
            "userID": user_id,
            "address": address
        }
        post_second_resp = requests.post(
            f"{BASE_URL}/api/v1/satsreward/address",
            json=payload_second,
            headers=headers,
            timeout=TIMEOUT
        )
        assert post_second_resp.status_code == 400, f"Expected 400 on duplicate address but got {post_second_resp.status_code}"
        resp_second_data = post_second_resp.json()
        # Validate error message contains duplicate indication (case insensitive)
        error_msg = resp_second_data.get("message") or resp_second_data.get("error") or ""
        assert "duplicate" in error_msg.lower() or "already exists" in error_msg.lower(), \
            f"Error message does not indicate duplicate address: {error_msg}"

    finally:
        # Cleanup: Delete created satsreward address if possible
        if created_address_id:
            try:
                requests.delete(
                    f"{BASE_URL}/api/v1/satsreward/address/{created_address_id}",
                    headers=headers,
                    timeout=TIMEOUT
                )
            except Exception:
                pass

test_post_satsreward_address_duplicate()