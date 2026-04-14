import requests
import time

base_url = "http://localhost:5000"

def test_get_users_with_ranks():
    signup_url = f"{base_url}/api/v1/user/auth/signup"
    signin_url = f"{base_url}/api/v1/user/auth/signin"
    ranking_url = f"{base_url}/api/v1/ranking/users"

    # Step 1: Sign up a new regular user (not admin)
    timestamp = int(time.time() * 1000)
    signup_payload = {
        "name": "Test User",
        "email": f"testuser_{timestamp}@test.com",
        "password": "Password123!",
        "agreedTermsOfService": True
    }

    resp_signup = requests.post(signup_url, json=signup_payload, timeout=30)
    assert resp_signup.status_code == 201, f"Signup failed: {resp_signup.text}"
    signup_data = resp_signup.json()
    assert "accessToken" in signup_data
    assert "refreshToken" in signup_data
    user_email = signup_payload["email"]
    user_password = signup_payload["password"]

    # Step 2: Sign in with created user to get tokens
    signin_payload = {"email": user_email, "password": user_password}
    resp_signin = requests.post(signin_url, json=signin_payload, timeout=30)
    assert resp_signin.status_code == 200, f"Signin failed: {resp_signin.text}"
    signin_data = resp_signin.json()
    user_access_token = signin_data.get("accessToken")
    assert user_access_token is not None

    # Step 3: Attempt GET /api/v1/ranking/users with non-admin user token, expect 403 Forbidden
    headers_user = {"Authorization": f"Bearer {user_access_token}"}
    resp_user_ranking = requests.get(ranking_url, headers=headers_user, timeout=30)
    assert resp_user_ranking.status_code == 403 or resp_user_ranking.status_code == 401, f"Expected 403/401 for non-admin user but got {resp_user_ranking.status_code}"

    # Since we cannot create admin users via the API, use the provided admin token from prompt:
    admin_token = (
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."
        "eyJleHAiOjE3NzYxODMzMTksImlhdCI6MTc3NjE0MDExOSwidXNlcklEIjoiZjUxNzg0ZTEtMjY3Ni00YTgzLWE5NzgtYTZlZTFjMDYwN2U2In0."
        "LpWpZKv3OKJ0kUBz9LxJVZraiDH1WvvL2kcu-5x4oyM"
    )
    headers_admin = {"Authorization": f"Bearer {admin_token}"}

    # Step 4: Call GET /api/v1/ranking/users with admin token
    resp_admin = requests.get(ranking_url, headers=headers_admin, timeout=30)
    assert resp_admin.status_code == 200, f"Admin GET ranking users failed: {resp_admin.text}"

    resp_json = resp_admin.json()
    assert isinstance(resp_json, dict), "Response JSON is not an object"
    # Expect a list of users with rank metrics in some field, often in 'data' or similar key
    # We validate presence of keys typical for ranking
    users_list = None
    if "data" in resp_json and isinstance(resp_json["data"], list):
        users_list = resp_json["data"]
    elif isinstance(resp_json.get("users"), list):
        users_list = resp_json["users"]
    else:
        # Fallback: try if root is list
        if isinstance(resp_json, list):
            users_list = resp_json

    assert users_list is not None, "Expected list of users in response"
    assert isinstance(users_list, list), "Users data is not a list"
    # If there is at least one user, validate rank keys
    if len(users_list) > 0:
        user_entry = users_list[0]
        # Check user entry contains expected rank metrics, e.g. rank, score or similar keys
        assert "rank" in user_entry or "score" in user_entry or "metrics" in user_entry, "User entry missing rank or metrics info"

test_get_users_with_ranks()