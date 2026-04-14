import requests
import uuid
import json
import time

BASE_URL = "http://localhost:5000"
TIMEOUT = 30


def test_post_attempt_with_valid_answer():
    # Step 1: Sign up a new user (regular user)
    timestamp = int(time.time() * 1000)
    signup_email = f"testuser_{timestamp}@test.com"
    signup_payload = {
        "name": "Test User",
        "email": signup_email,
        "password": "TestPass123!",
        "agreedTermsOfService": True
    }
    signup_resp = requests.post(f"{BASE_URL}/api/v1/user/auth/signup", json=signup_payload, timeout=TIMEOUT)
    assert signup_resp.status_code == 201, f"Signup failed: {signup_resp.text}"
    signup_data = signup_resp.json()
    access_token = signup_data.get("accessToken")
    refresh_token = signup_data.get("refreshToken")
    user = signup_data.get("user")
    assert access_token and refresh_token and user and "id" in user, "Missing tokens or user ID from signup response"
    user_id = user["id"]

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    # Step 2: Get list of quizzes (authenticated, non-admin)
    quizzes_resp = requests.get(f"{BASE_URL}/api/v1/quiz/", headers=headers, timeout=TIMEOUT)
    assert quizzes_resp.status_code == 200, f"Get quizzes failed: {quizzes_resp.text}"
    quizzes_data = quizzes_resp.json()
    # quizzes_data should contain "status" key and array of quizzes in data or root
    quizzes = quizzes_data.get("data") or quizzes_data
    assert isinstance(quizzes, list) and len(quizzes) > 0, "No quizzes available"

    # Find an attemptable quiz by trying to get quiz attempt data
    # We'll attempt to find a quiz ID for which GET /api/v1/quiz/attempt/:id returns 200
    attemptable_quiz_id = None
    question_id = None
    answer_id = None

    for quiz in quizzes:
        quiz_id = quiz.get("id") or quiz.get("quizID") or quiz.get("_id") or quiz.get("uuid")
        if not quiz_id:
            continue
        attempt_resp = requests.get(f"{BASE_URL}/api/v1/quiz/attempt/{quiz_id}", headers=headers, timeout=TIMEOUT)
        if attempt_resp.status_code == 200:
            attempt_data = attempt_resp.json()
            questions = attempt_data.get("questions") or attempt_data.get("data") or []
            if isinstance(questions, list) and len(questions) > 0:
                # Select the first question with answers
                for question in questions:
                    q_id = question.get("id") or question.get("questionID") or question.get("uuid")
                    if not q_id:
                        continue
                    answers = question.get("answers") or []
                    if isinstance(answers, list) and len(answers) > 0:
                        # Pick first answer id
                        a_id = answers[0].get("id") or answers[0].get("answerID") or answers[0].get("uuid")
                        if a_id:
                            attemptable_quiz_id = quiz_id
                            question_id = q_id
                            answer_id = a_id
                            break
            if attemptable_quiz_id:
                break

    # If no attemptable quiz with questions and answers found, skip test by failing with message
    assert attemptable_quiz_id and question_id and answer_id, "No attemptable quiz with questions and answers found"

    # Step 3: POST /api/v1/attempt/ with valid payload and Bearer token
    # answerIDList must be a JSON-stringified array of UUID strings
    answer_id_list_json_str = json.dumps([answer_id])
    attempt_payload = {
        "userID": user_id,
        "questionID": question_id,
        "answerIDList": answer_id_list_json_str
    }

    attempt_resp = requests.post(f"{BASE_URL}/api/v1/attempt/", headers=headers, json=attempt_payload, timeout=TIMEOUT)

    # According to instructions, expect 200 with message 'Attempt created successfully!' and data array.
    # The PRD says POST endpoints that create resources return 201 now, but TC010 expects 200.
    # We'll assert status code 200 explicitly.
    assert attempt_resp.status_code == 200, f"Attempt creation failed: {attempt_resp.text}"
    attempt_resp_json = attempt_resp.json()
    # Validate response message and data array
    msg = attempt_resp_json.get("message") or attempt_resp_json.get("msg") or ""
    data = attempt_resp_json.get("data") or attempt_resp_json.get("attempts") or []
    assert "Attempt created successfully" in msg, f"Unexpected response message: {msg}"
    assert isinstance(data, list), "Response data is not an array"


test_post_attempt_with_valid_answer()