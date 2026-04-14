import requests
import time
import uuid

BASE_URL = "http://localhost:5000"
TIMEOUT = 30

def test_post_sats_reward_address():
    # Step 1: Sign up a new user to get valid credentials
    timestamp = int(time.time() * 1000)
    unique_email = f"testuser_{timestamp}@test.com"
    signup_payload = {
        "name": "Test User",
        "email": unique_email,
        "password": "TestPass123!",
        "agreedTermsOfService": True
    }
    signup_resp = requests.post(
        f"{BASE_URL}/api/v1/user/auth/signup",
        json=signup_payload,
        timeout=TIMEOUT
    )
    assert signup_resp.status_code == 201, f"Signup failed: {signup_resp.text}"
    signup_data = signup_resp.json()
    assert "accessToken" in signup_data, "accessToken missing in signup response"
    assert "refreshToken" in signup_data, "refreshToken missing in signup response"
    assert "user" in signup_data, "user object missing in signup response"
    user_id = signup_data["user"]["id"]
    access_token = signup_data["accessToken"]

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    # Step 2: POST to /api/v1/satsreward/address with userId and address
    # Use a unique address for the test
    unique_address = f"testaddress_{uuid.uuid4().hex[:8]}@ln.tips"
    address_payload = {
        "userId": user_id,
        "address": unique_address
    }

    post_data = None
    try:
        post_resp = requests.post(
            f"{BASE_URL}/api/v1/satsreward/address",
            json=address_payload,
            headers=headers,
            timeout=TIMEOUT
        )
        assert post_resp.status_code == 201, f"Expected 201, got {post_resp.status_code}: {post_resp.text}"
        post_data = post_resp.json()

        # Validate response contains created SatsRewardAddress info
        # Since PRD mentions return is the created object, check keys accordingly
        assert isinstance(post_data, dict), "Response data is not a JSON object"
        assert post_data.get("userId") == user_id, "userId mismatch in response"
        assert post_data.get("address") == unique_address, "address mismatch in response"
        assert "id" in post_data, "Created resource ID missing in response"
    finally:
        # Clean-up: delete the created sats reward address if possible
        # The PRD or instructions do not include a DELETE endpoint for satsreward/address,
        # so attempt to delete cautiously or skip if not supported
        try:
            if post_data and post_data.get("id"):
                resource_id = post_data.get("id")
                delete_resp = requests.delete(
                    f"{BASE_URL}/api/v1/satsreward/address/{resource_id}",
                    headers=headers,
                    timeout=TIMEOUT
                )
                # Accept 200, 204, or 404 (if already deleted) as okay
                if delete_resp.status_code not in [200, 204, 404]:
                    print(f"Warning: failed to delete sats reward address {resource_id}, status {delete_resp.status_code}")
        except Exception as e:
            # Log exception during cleanup but do not fail the test for cleanup issues
            print(f"Cleanup error: {e}")

test_post_sats_reward_address()
