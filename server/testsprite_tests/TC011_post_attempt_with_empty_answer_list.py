import requests
import time
import uuid
import json

BASE_URL = "http://localhost:5000"
TIMEOUT = 30


def test_post_attempt_empty_answer_list():
    try:
        # Step 1: Signup to create a fresh user
        timestamp = int(time.time() * 1000)
        signup_email = f"testuser_{timestamp}@test.com"
        signup_payload = {
            "name": "Test User",
            "email": signup_email,
            "password": "Password123!",
            "agreedTermsOfService": True
        }
        signup_resp = requests.post(
            f"{BASE_URL}/api/v1/user/auth/signup",
            json=signup_payload,
            timeout=TIMEOUT
        )
        assert signup_resp.status_code == 201, f"Signup failed: {signup_resp.text}"
        signup_data = signup_resp.json()
        access_token = signup_data.get("accessToken")
        user = signup_data.get("user", {})
        user_id = user.get("id")
        assert access_token and user_id, "Signup response missing accessToken or user ID"

        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }

        # Create dummy IDs for questionID and empty answerIDList as string-encoded JSON array (empty list)
        # Since the test case does not provide question ID, create a quiz and question if needed
        # But per instructions, if resource IDs not provided create new resource and clean up
        # However, POST /api/v1/question/ requires admin -> we cannot create question
        # Instead, we can generate random UUIDs for questionID because the validation for empty answer list should trigger before question existence is checked
        question_id = str(uuid.uuid4())

        # Compose attempt payload with empty answerIDList stringified as JSON "[]"
        attempt_payload = {
            "userID": user_id,
            "questionID": question_id,
            "answerIDList": "[]"
        }

        # Step 2: Send POST /api/v1/attempt/ with empty answerIDList
        attempt_resp = requests.post(
            f"{BASE_URL}/api/v1/attempt/",
            headers=headers,
            json=attempt_payload,
            timeout=TIMEOUT
        )

        # Validate response: Expect 400 with message 'Please provide an answer!'
        assert attempt_resp.status_code == 400, f"Expected 400, got {attempt_resp.status_code}, response: {attempt_resp.text}"
        resp_json = attempt_resp.json()
        error_message = resp_json.get("message") or resp_json.get("error") or resp_json.get("msg")
        assert error_message == "Please provide an answer!", f"Unexpected error message: {error_message}"

    except requests.RequestException as e:
        assert False, f"Request failed: {e}"


test_post_attempt_empty_answer_list()