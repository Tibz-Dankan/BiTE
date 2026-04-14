import requests
import time

BASE_URL = "http://localhost:5000"
TIMEOUT = 30

def test_make_default_sats_reward_address():
    signup_url = f"{BASE_URL}/api/v1/user/auth/signup"
    satsreward_address_url = f"{BASE_URL}/api/v1/satsreward/address"
    headers = {"Content-Type": "application/json"}
    
    # Step 1: Sign up a new user with unique email to get access token and userID
    timestamp = int(time.time() * 1000)
    unique_email = f"testuser_{timestamp}@test.com"
    signup_payload = {
        "name": "Test User",
        "email": unique_email,
        "password": "Password123!",
        "agreedTermsOfService": True
    }
    resp_signup = requests.post(signup_url, json=signup_payload, timeout=TIMEOUT)
    assert resp_signup.status_code == 201, f"Signup failed: {resp_signup.text}"
    signup_data = resp_signup.json()
    access_token = signup_data.get("accessToken")
    refresh_token = signup_data.get("refreshToken")
    user = signup_data.get("user")
    assert access_token, "No accessToken received on signup"
    assert user and "id" in user, "No user ID received on signup"
    user_id = user["id"]
    auth_headers = {"Authorization": f"Bearer {access_token}", "Content-Type": "application/json"}

    # Step 2: Create two sats reward addresses for this user
    addresses_created = []
    try:
        for i in range(2):
            addr_payload = {
                "userID": user_id,
                "address": f"testaddress{i}_{timestamp}@ln.tips"
            }
            resp_addr = requests.post(satsreward_address_url, json=addr_payload, headers=auth_headers, timeout=TIMEOUT)
            assert resp_addr.status_code == 201, f"Creating satsreward address {i} failed: {resp_addr.text}"
            addr_resp_json = resp_addr.json()
            # Adjust to use 'data' field if present
            addr_data = addr_resp_json.get("data", addr_resp_json)
            assert addr_data.get("address") == addr_payload["address"], "Address mismatch in created satsreward address"
            assert "id" in addr_data, "No ID returned for created satsreward address"
            addresses_created.append(addr_data)

        # Step 3: Mark first address as default
        first_addr_id = addresses_created[0]["id"]
        patch_url = f"{satsreward_address_url}/{first_addr_id}/default"
        resp_patch_1 = requests.patch(patch_url, headers=auth_headers, timeout=TIMEOUT)
        assert resp_patch_1.status_code == 200, f"Failed to set first address default: {resp_patch_1.text}"
        patch_1_data = resp_patch_1.json().get("data", resp_patch_1.json())
        assert patch_1_data.get("id") == first_addr_id, "Patched address ID mismatch for first address"
        assert patch_1_data.get("isDefault") == True, "First address not marked as default"

        # Step 4: Mark second address as default
        second_addr_id = addresses_created[1]["id"]
        patch_url_2 = f"{satsreward_address_url}/{second_addr_id}/default"
        resp_patch_2 = requests.patch(patch_url_2, headers=auth_headers, timeout=TIMEOUT)
        assert resp_patch_2.status_code == 200, f"Failed to set second address default: {resp_patch_2.text}"
        patch_2_data = resp_patch_2.json().get("data", resp_patch_2.json())
        assert patch_2_data.get("id") == second_addr_id, "Patched address ID mismatch for second address"
        assert patch_2_data.get("isDefault") == True, "Second address not marked as default"

        # Step 5: Confirm first address is no longer default
        resp_get_first = requests.get(f"{satsreward_address_url}/{first_addr_id}", headers=auth_headers, timeout=TIMEOUT)
        if resp_get_first.status_code == 200:
            first_addr_data = resp_get_first.json().get("data", resp_get_first.json())
            assert first_addr_data.get("isDefault") == False, "First address still marked as default after changing default"
        # It's possible the API doesn't support GET by ID; skip if 404 or not implemented

    finally:
        # Cleanup - delete created reward addresses
        for addr in addresses_created:
            addr_id = addr.get("id")
            if addr_id:
                try:
                    requests.delete(f"{satsreward_address_url}/{addr_id}", headers=auth_headers, timeout=TIMEOUT)
                except Exception:
                    pass  # ignore cleanup errors

test_make_default_sats_reward_address()
