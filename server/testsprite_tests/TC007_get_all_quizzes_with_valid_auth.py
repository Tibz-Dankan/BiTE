import requests
import time
import uuid

BASE_URL = "http://localhost:5000"
TIMEOUT = 30

def test_get_all_quizzes_with_valid_auth():
    # Step 1: Signup a fresh user to get valid credentials
    signup_url = f"{BASE_URL}/api/v1/user/auth/signup"
    timestamp = int(time.time() * 1000)
    random_email = f"testuser_{timestamp}@test.com"
    signup_payload = {
        "name": "Test User",
        "email": random_email,
        "password": "TestPass123!",
        "agreedTermsOfService": True
    }
    signup_resp = requests.post(signup_url, json=signup_payload, timeout=TIMEOUT)
    assert signup_resp.status_code == 201, f"Signup failed: {signup_resp.text}"
    signup_data = signup_resp.json()
    assert "accessToken" in signup_data and "user" in signup_data, "Signup response missing tokens or user data"
    access_token = signup_data["accessToken"]

    # Step 2: Use the accessToken to call GET /api/v1/quiz/
    quizzes_url = f"{BASE_URL}/api/v1/quiz/"
    headers = {
        "Authorization": f"Bearer {access_token}"
    }
    quizzes_resp = requests.get(quizzes_url, headers=headers, timeout=TIMEOUT)
    assert quizzes_resp.status_code == 200, f"Failed to get quizzes: {quizzes_resp.text}"

    quizzes_data = quizzes_resp.json()
    # Expecting status=success and quizzes data as array
    assert isinstance(quizzes_data, dict), "Response is not a JSON object"
    assert quizzes_data.get("status") == "success", f"Unexpected status: {quizzes_data.get('status')}"
    assert "data" in quizzes_data, "Response missing data field"
    assert isinstance(quizzes_data["data"], list), "Data field is not a list of quizzes"

test_get_all_quizzes_with_valid_auth()