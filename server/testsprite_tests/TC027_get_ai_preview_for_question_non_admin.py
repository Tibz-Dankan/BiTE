import requests
import time
import uuid

BASE_URL = "http://localhost:5000"
TIMEOUT = 30


def test_get_ai_preview_for_question_non_admin():
    # Step 1: Sign up a fresh non-admin user to get valid credentials
    timestamp = int(time.time() * 1000)
    email = f"testuser_{timestamp}@test.com"
    password = "TestPass123!"
    signup_payload = {
        "name": "Test User",
        "email": email,
        "password": password,
        "agreedTermsOfService": True
    }
    signup_resp = requests.post(
        f"{BASE_URL}/api/v1/user/auth/signup",
        json=signup_payload,
        timeout=TIMEOUT
    )
    assert signup_resp.status_code == 201, f"Signup failed: {signup_resp.text}"
    signup_data = signup_resp.json()
    assert "accessToken" in signup_data and "user" in signup_data, "Signup response missing tokens or user"
    access_token = signup_data["accessToken"]
    user_id = signup_data["user"]["id"]

    headers = {"Authorization": f"Bearer {access_token}"}

    # Step 2: Get any quiz available for this non-admin user to find a quizID
    quizzes_resp = requests.get(f"{BASE_URL}/api/v1/quiz/", headers=headers, timeout=TIMEOUT)
    assert quizzes_resp.status_code == 200, f"Failed to get quizzes: {quizzes_resp.text}"
    quizzes_data = quizzes_resp.json()
    quizzes_list = []
    if isinstance(quizzes_data, dict) and "data" in quizzes_data:
        quizzes_list = quizzes_data["data"]
    elif isinstance(quizzes_data, list):
        quizzes_list = quizzes_data
    assert quizzes_list, "No quizzes returned for non-admin user"

    quiz_id = None
    if isinstance(quizzes_list[0], dict) and "id" in quizzes_list[0]:
        quiz_id = quizzes_list[0]["id"]
    assert quiz_id, "Invalid quiz ID found"

    # Step 3: Get quiz attempt data for the first quiz
    attempt_resp = requests.get(f"{BASE_URL}/api/v1/quiz/attempt/{quiz_id}", headers=headers, timeout=TIMEOUT)
    assert attempt_resp.status_code == 200, f"Failed to get quiz attempt: {attempt_resp.text}"
    attempt_data = attempt_resp.json()

    # Adjust parsing because response might wrap 'questions' inside 'data'
    questions = []
    if isinstance(attempt_data, dict):
        if "questions" in attempt_data and isinstance(attempt_data["questions"], list):
            questions = attempt_data["questions"]
        elif "data" in attempt_data and isinstance(attempt_data["data"], dict) and "questions" in attempt_data["data"]:
            questions = attempt_data["data"]["questions"]
    assert questions, "No questions found in quiz attempt data"

    question_id = None
    for question in questions:
        if isinstance(question, dict) and "id" in question:
            question_id = question["id"]
            break
    assert question_id, "No questionID found in quiz attempt data"

    # Step 4: Call GET /api/v1/aipreview/question/:questionID with non-admin Bearer token
    aipreview_url = f"{BASE_URL}/api/v1/aipreview/question/{question_id}"
    preview_resp = requests.get(aipreview_url, headers=headers, timeout=TIMEOUT)
    assert preview_resp.status_code == 200, f"GET AI preview failed: {preview_resp.text}"
    preview_data = preview_resp.json()

    # Step 5: Validate the response contains only the default preview for the question
    if isinstance(preview_data, list):
        assert len(preview_data) == 1, "Expected only one default preview"
        preview_item = preview_data[0]
        assert preview_item.get("default", True) is True, "Preview is not default"
        assert preview_item.get("questionId") == question_id, "Preview questionId mismatch"
    elif isinstance(preview_data, dict):
        assert preview_data.get("default", True) is True, "Preview is not default"
        assert preview_data.get("questionId") == question_id, "Preview questionId mismatch"
    else:
        assert False, f"Unexpected response format: {type(preview_data)}"


test_get_ai_preview_for_question_non_admin()
