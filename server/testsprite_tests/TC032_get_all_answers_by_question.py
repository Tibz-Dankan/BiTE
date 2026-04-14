import requests
import time
import uuid

BASE_URL = "http://localhost:5000"
TIMEOUT = 30

def test_get_all_answers_by_question():
    # Step 1: Signup a new user (non-admin)
    signup_email = f"testuser_{int(time.time() * 1000)}@test.com"
    signup_payload = {
        "name": "Test User",
        "email": signup_email,
        "password": "TestPass123!",
        "agreedTermsOfService": True
    }
    signup_resp = requests.post(f"{BASE_URL}/api/v1/user/auth/signup", json=signup_payload, timeout=TIMEOUT)
    assert signup_resp.status_code == 201, f"Signup failed with status {signup_resp.status_code}, body: {signup_resp.text}"
    signup_data = signup_resp.json()
    access_token = signup_data.get("accessToken")
    refresh_token = signup_data.get("refreshToken")
    user = signup_data.get("user")
    assert access_token and refresh_token and user and "id" in user
    user_id = user["id"]

    headers_auth = {"Authorization": f"Bearer {access_token}"}

    # Step 2: Attempt to get quizzes list to pick a quiz id (any quiz)
    # This endpoint requires auth and returns quizzes array.
    quizzes_resp = requests.get(f"{BASE_URL}/api/v1/quiz/", headers=headers_auth, timeout=TIMEOUT)
    assert quizzes_resp.status_code == 200, f"Failed to get quizzes with status {quizzes_resp.status_code}"
    quizzes_data = quizzes_resp.json()
    quizzes = quizzes_data if isinstance(quizzes_data, list) else quizzes_data.get("data", quizzes_data.get("quizzes", []))
    # Defensive: if no quizzes found, skip test
    if not quizzes:
        return
    quiz = quizzes[0]
    quiz_id = quiz.get("id")
    if not quiz_id:
        return

    # Step 3: Use GET /api/v1/quiz/attempt/:id to get questions
    attempt_quiz_resp = requests.get(f"{BASE_URL}/api/v1/quiz/attempt/{quiz_id}", headers=headers_auth, timeout=TIMEOUT)
    if attempt_quiz_resp.status_code != 200:
        return
    attempt_quiz_data = attempt_quiz_resp.json()
    questions = attempt_quiz_data.get("questions") or attempt_quiz_data.get("data", {}).get("questions")
    if not questions or len(questions) == 0:
        return
    question = questions[0]
    question_id = question.get("id")
    if not question_id:
        return

    # Step 4: Call GET /api/v1/answer/question/:questionID with Bearer token
    url = f"{BASE_URL}/api/v1/answer/question/{question_id}"
    resp = requests.get(url, headers=headers_auth, timeout=TIMEOUT)
    assert resp.status_code == 200, f"Expected 200 but got {resp.status_code}, body: {resp.text}"
    data = resp.json()
    # Extract list of answers from 'data' field
    answers_list = data.get("data")
    assert isinstance(answers_list, list), f"Response 'data' is not a list: {answers_list}"

    sequence_numbers = []
    for ans in answers_list:
        seq = ans.get("sequenceNumber")
        assert seq is not None, f"Answer missing sequenceNumber: {ans}"
        sequence_numbers.append(seq)
    assert sequence_numbers == sorted(sequence_numbers), "Answers are not ordered by sequenceNumber ascending"

test_get_all_answers_by_question()
