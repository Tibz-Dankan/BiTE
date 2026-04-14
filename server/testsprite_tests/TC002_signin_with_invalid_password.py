import requests
import time
import uuid

BASE_URL = "http://localhost:5000"


def test_signin_with_invalid_password():
    # Step 1: Signup a new user to get valid email and password
    signup_url = f"{BASE_URL}/api/v1/user/auth/signup"
    timestamp = int(time.time() * 1000)
    email = f"testuser_{timestamp}@test.com"
    password = "ValidPass123!"
    signup_payload = {
        "name": f"Test User {timestamp}",
        "email": email,
        "password": password,
        "agreedTermsOfService": True
    }

    try:
        signup_resp = requests.post(signup_url, json=signup_payload, timeout=30)
        assert signup_resp.status_code == 201, f"Signup failed with status {signup_resp.status_code}"
        signup_data = signup_resp.json()
        assert "user" in signup_data and "email" in signup_data["user"], "Signup response missing user data"
        assert signup_data["user"]["email"] == email, "Signup returned wrong email"
    except Exception as e:
        raise AssertionError(f"Signup step failed: {e}")

    # Step 2: Attempt signin with the correct email but wrong password
    signin_url = f"{BASE_URL}/api/v1/user/auth/signin"
    invalid_password_payload = {
        "email": email,
        "password": "WrongPassword!123"
    }
    try:
        signin_resp = requests.post(signin_url, json=invalid_password_payload, timeout=30)
        assert signin_resp.status_code == 400, f"Signin with invalid password should return 400 but got {signin_resp.status_code}"
        signin_data = signin_resp.json()
        assert "message" in signin_data, "Error message missing in signin response"
        assert signin_data["message"] == "Invalid email/password!", f"Unexpected error message: {signin_data['message']}"
    except Exception as e:
        raise AssertionError(f"Signin with invalid password failed: {e}")


test_signin_with_invalid_password()