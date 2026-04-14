import requests
import time

base_url = "http://localhost:5000"
timeout = 30

def test_tc016_get_admin_analytics():
    signup_url = f"{base_url}/api/v1/user/auth/signup"
    signin_url = f"{base_url}/api/v1/user/auth/signin"
    analytics_url = f"{base_url}/api/v1/analytics/admin"

    # Step 1: Sign up a new regular user (cannot create admin)
    timestamp = int(time.time() * 1000)
    signup_payload = {
        "name": "Test User TC016",
        "email": f"testuser_{timestamp}@test.com",
        "password": "TestPassword123!",
        "agreedTermsOfService": True
    }
    signup_resp = requests.post(signup_url, json=signup_payload, timeout=timeout)
    assert signup_resp.status_code == 201, f"Signup failed: {signup_resp.text}"
    signup_data = signup_resp.json()
    assert signup_data.get("status") == "success"
    user_email = signup_payload["email"]
    user_password = signup_payload["password"]

    # Step 2: Sign in with the created user credentials to get access token (non-admin token)
    signin_payload = {"email": user_email, "password": user_password}
    signin_resp = requests.post(signin_url, json=signin_payload, timeout=timeout)
    assert signin_resp.status_code == 200, f"Signin failed: {signin_resp.text}"
    signin_data = signin_resp.json()
    assert signin_data.get("status") == "success"
    access_token = signin_data["accessToken"]

    # Step 3: Call the admin analytics endpoint with non-admin bearer token; expect 403 Forbidden
    headers_user = {"Authorization": f"Bearer {access_token}"}
    resp_non_admin = requests.get(analytics_url, headers=headers_user, timeout=timeout)
    assert resp_non_admin.status_code == 403, "Expected 403 Forbidden for non-admin user"

    # Step 4: Call the admin analytics endpoint with the provided real admin Bearer token
    admin_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NzYxODMzMTksImlhdCI6MTc3NjE0MDExOSwidXNlcklEIjoiZjUxNzg0ZTEtMjY3Ni00YTgzLWE5NzgtYTZlZTFjMDYwN2U2In0.LpWpZKv3OKJ0kUBz9LxJVZraiDH1WvvL2kcu-5x4oyM"
    headers_admin = {"Authorization": f"Bearer {admin_token}"}
    resp_admin = requests.get(analytics_url, headers=headers_admin, timeout=timeout)
    assert resp_admin.status_code == 200, f"Expected 200 OK for admin user, got {resp_admin.status_code}"
    json_data = resp_admin.json()
    assert json_data.get("status") == "success", f"Unexpected status in response: {json_data}"
    # Optionally further checks on the response structure can be added here

test_tc016_get_admin_analytics()