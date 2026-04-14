import requests
import time

BASE_URL = "http://localhost:5000"

def test_get_question_with_answers_and_attachments():
    session = requests.Session()
    timeout = 30

    # Step 1: Sign up a fresh user to get valid credentials
    timestamp = int(time.time() * 1000)
    signup_email = f"testuser_{timestamp}@test.com"
    signup_payload = {
        "name": "Test User",
        "email": signup_email,
        "password": "TestPass123!",
        "agreedTermsOfService": True
    }
    signup_resp = session.post(f"{BASE_URL}/api/v1/user/auth/signup", json=signup_payload, timeout=timeout)
    assert signup_resp.status_code == 201, f"Signup failed: {signup_resp.text}"
    signup_data = signup_resp.json()
    access_token = signup_data.get("accessToken")
    refresh_token = signup_data.get("refreshToken")
    user_obj = signup_data.get("user")
    assert access_token and refresh_token and user_obj, "Signup response missing tokens or user"
    user_id = user_obj.get("id")
    assert user_id, "User ID missing in signup response"

    headers = {"Authorization": f"Bearer {access_token}"}

    # Step 2: Get list of quizzes (no admin required, just auth) to find one quizID - skip if none exist
    quizzes_resp = session.get(f"{BASE_URL}/api/quizzes", headers=headers, timeout=timeout)
    assert quizzes_resp.status_code == 200, f"Get quizzes failed: {quizzes_resp.text}"
    quizzes_data = quizzes_resp.json()
    assert quizzes_data.get("status") == "success", "Quizzes response status not success"
    quizzes_list = quizzes_data.get("data")
    assert isinstance(quizzes_list, list), "Quizzes data is not a list"
    if not quizzes_list:
        # No quizzes available to test question - skip or raise
        assert False, "No quizzes available to test question retrieval"

    quiz_id = quizzes_list[0].get("id")
    assert quiz_id, "No valid quiz ID found in quizzes response"

    # Since question creation requires admin and question ID is unknown, skip test with assertion.
    assert False, (
        "No question ID provided and cannot create question without admin role. "
        "Cannot perform GET /api/v1/question/:id."
    )

# Now call the test function

test_get_question_with_answers_and_attachments()
