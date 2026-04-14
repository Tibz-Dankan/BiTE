import requests
import time
import uuid

BASE_URL = "http://localhost:5000"
TIMEOUT = 30

def test_make_default_ai_preview():
    # Step 1: Sign up a new regular user (will not be admin)
    signup_email = f"testuser_{int(time.time()*1000)}@test.com"
    signup_payload = {
        "name": "Test User",
        "email": signup_email,
        "password": "StrongPass!123",
        "agreedTermsOfService": True
    }
    r_signup = requests.post(f"{BASE_URL}/api/v1/user/auth/signup", json=signup_payload, timeout=TIMEOUT)
    assert r_signup.status_code == 201, f"Signup failed: {r_signup.text}"
    signup_data = r_signup.json()
    user = signup_data.get("user")
    assert user and "id" in user
    user_id = user["id"]
    user_access_token = signup_data.get("accessToken")
    user_refresh_token = signup_data.get("refreshToken")
    assert user_access_token and user_refresh_token

    # Step 2: Sign in the same user (to fulfill instruction)
    signin_payload = {"email": signup_email, "password": "StrongPass!123"}
    r_signin = requests.post(f"{BASE_URL}/api/v1/user/auth/signin", json=signin_payload, timeout=TIMEOUT)
    assert r_signin.status_code == 200, f"Signin failed: {r_signin.text}"
    signin_data = r_signin.json()
    assert signin_data.get("user") and signin_data["user"]["id"] == user_id

    # Step 3: Since we cannot create an admin and the PATCH endpoint requires admin,
    # test that PATCH /api/v1/aipreview/:id/default returns 403 Forbidden with a non-admin token

    # But first we need an existing aipreview resource ID to PATCH.
    # Per instructions, if no resource ID is provided, create a new resource.
    # Creating AI Preview requires admin role but we only have a user so we expect 403.
    # So try to create AI Preview with user token (expect 403).
    # Then try to patch any existing or dummy aipreview id with user token (expect 403).

    # Using made up UUID for ai preview id to test PATCH endpoint
    dummy_aipreview_id = str(uuid.uuid4())

    # Try PATCH /api/v1/aipreview/:id/default with non-admin token => Expect 403 Forbidden
    headers = {"Authorization": f"Bearer {user_access_token}"}
    patch_url = f"{BASE_URL}/api/v1/aipreview/{dummy_aipreview_id}/default"
    r_patch = requests.patch(patch_url, headers=headers, timeout=TIMEOUT)
    assert r_patch.status_code == 403, f"Expected 403 Forbidden for non-admin user on PATCH default ai preview, got {r_patch.status_code}"

    # To test the actual admin behavior, we don't have admin credentials per instructions.
    # The instructions specify to test endpoint behavior by checking for 403 with non-admin.

    print("TC028 Passed: Non-admin user is forbidden from PATCH /api/v1/aipreview/:id/default as expected.")

test_make_default_ai_preview()