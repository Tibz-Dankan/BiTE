import requests
import time
import uuid

BASE_URL = "http://localhost:5000"
TIMEOUT = 30


def test_create_question_with_duplicate_sequence_number():
    # Step 1: Signup to create a regular user (non-admin)
    timestamp = int(time.time() * 1000)
    signup_email = f"testuser_{timestamp}@test.com"
    signup_password = "TestPassword123!"
    signup_payload = {
        "name": "Test User",
        "email": signup_email,
        "password": signup_password,
        "agreedTermsOfService": True
    }
    signup_resp = requests.post(f"{BASE_URL}/api/v1/user/auth/signup", json=signup_payload, timeout=TIMEOUT)
    assert signup_resp.status_code == 201, f"Signup failed: {signup_resp.text}"
    signup_data = signup_resp.json()
    user_id = signup_data["user"]["id"]
    access_token = signup_data["accessToken"]

    # Step 2: Use signin with the same credentials to get tokens (per instructions)
    signin_payload = {"email": signup_email, "password": signup_password}
    signin_resp = requests.post(f"{BASE_URL}/api/v1/user/auth/signin", json=signin_payload, timeout=TIMEOUT)
    assert signin_resp.status_code == 200, f"Signin failed: {signin_resp.text}"
    signin_data = signin_resp.json()
    access_token = signin_data["accessToken"]
    user_id = signin_data["user"]["id"]

    headers = {"Authorization": f"Bearer {access_token}"}

    # Step 3: GET /api/v1/quiz/ to check if user can list quizzes (should be allowed without admin)
    quizzes_resp = requests.get(f"{BASE_URL}/api/v1/quiz/", headers=headers, timeout=TIMEOUT)
    assert quizzes_resp.status_code == 200, f"Failed to get quizzes: {quizzes_resp.text}"
    quizzes_data = quizzes_resp.json()
    quizzes = quizzes_data if isinstance(quizzes_data, list) else quizzes_data.get("data", [])
    # If no quizzes exist, cannot proceed meaningfully; skip test with assertion
    assert isinstance(quizzes, list), f"Unexpected quizzes response: {quizzes_data}"
    if not quizzes:
        # No quizzes to test on; skip the test meaningfully
        print("No quizzes found for the user to test. Skipping test.")
        return

    # Pick first quiz's ID for testing
    quiz_id = quizzes[0]["id"]

    # Step 4: Try to create a first question with sequenceNumber=1 - Expect 403 Forbidden due to not admin
    question_payload_1 = {
        "postedByUserID": user_id,
        "title": "First question for duplicate test",
        "quizID": quiz_id,
        "sequenceNumber": 1,
        "hasMultipleCorrectAnswers": "false",
        "requiresNumericalAnswer": "false"
    }
    # POST as multipart/form-data
    resp1 = requests.post(
        f"{BASE_URL}/api/v1/question/",
        headers=headers,
        data=question_payload_1,
        timeout=TIMEOUT
    )
    # The API requires admin; so expect 403 Forbidden
    assert resp1.status_code == 403, f"Expected 403 Forbidden for non-admin POST question, got {resp1.status_code}: {resp1.text}"

    # Step 5: Since we cannot create a question without admin, we cannot actually test duplicate sequenceNumber with admin token here.
    # Per instructions: "For endpoints that REQUIRE admin ..., test the endpoint behavior by checking that the response correctly returns a 403 when using a non-admin user"

    # Hence the test is complete here.

test_create_question_with_duplicate_sequence_number()