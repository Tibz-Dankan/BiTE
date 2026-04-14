import requests
import time
import json

BASE_URL = "http://localhost:5000"
TIMEOUT = 30

def test_post_attempt_duplicate_question_attempt():
    # Step 1: Signup a fresh user to get valid credentials
    timestamp = int(time.time() * 1000)
    signup_email = f"testuser_{timestamp}@test.com"
    signup_payload = {
        "name": "Test User",
        "email": signup_email,
        "password": "TestPass123!",
        "agreedTermsOfService": True,
    }
    signup_resp = requests.post(
        f"{BASE_URL}/api/v1/user/auth/signup",
        json=signup_payload,
        timeout=TIMEOUT,
    )
    assert signup_resp.status_code == 201, f"Signup failed: {signup_resp.text}"
    signup_data = signup_resp.json()
    access_token = signup_data.get("accessToken")
    refresh_token = signup_data.get("refreshToken")
    user = signup_data.get("user")
    assert access_token and refresh_token and user, "Invalid signup response"
    user_id = user.get("id")
    assert user_id, "User ID missing from signup response"

    headers_auth = {"Authorization": f"Bearer {access_token}"}

    # Step 2: Get a quiz to attempt - use /api/v1/quiz/ as per PRD
    quizzes_resp = requests.get(f"{BASE_URL}/api/v1/quiz/", headers=headers_auth, timeout=TIMEOUT)
    assert quizzes_resp.status_code == 200, f"Fetching quizzes failed: {quizzes_resp.text}"
    quizzes_data = quizzes_resp.json()
    quizzes_list = []
    # Attempt to extract quizzes list
    if isinstance(quizzes_data, dict):
        for key in ["data", "quizzes", "quiz"]:
            if key in quizzes_data and isinstance(quizzes_data[key], list):
                quizzes_list = quizzes_data[key]
                break
        # fallback if top-level is an array under some key
        if not quizzes_list:
            # look for top-level list values (unlikely but safe)
            for v in quizzes_data.values():
                if isinstance(v, list):
                    quizzes_list = v
                    break
    elif isinstance(quizzes_data, list):
        quizzes_list = quizzes_data

    assert quizzes_list, "No quizzes available to attempt"

    quiz_id = None
    for q in quizzes_list:
        if isinstance(q, dict) and q.get("id"):
            quiz_id = q["id"]
            break
    assert quiz_id, "No quiz ID found"

    # Step 3: Get quiz questions and answers (for picking question and answer)
    # Using GET /api/v1/quiz/attempt/:id which requires auth
    attempt_quiz_resp = requests.get(f"{BASE_URL}/api/v1/quiz/attempt/{quiz_id}", headers=headers_auth, timeout=TIMEOUT)
    # It may respond 400 if quiz not attemptable, skip if so
    if attempt_quiz_resp.status_code == 400:
        raise AssertionError(f"Quiz not attemptable: {attempt_quiz_resp.text}")
    assert attempt_quiz_resp.status_code == 200, f"Fetching quiz attempt data failed: {attempt_quiz_resp.text}"
    attempt_quiz_data = attempt_quiz_resp.json()
    questions = attempt_quiz_data.get("questions") or attempt_quiz_data.get("data") or []
    assert questions, "No questions found for quiz"
    question = questions[0]
    question_id = question.get("id")
    assert question_id, "Question ID missing"

    answers = question.get("answers") or []
    assert answers, "No answers found for question"
    answer_id = None
    for ans in answers:
        if ans.get("id"):
            answer_id = ans["id"]
            break
    assert answer_id, "Answer ID missing"

    # Step 4: Make first attempt POST /api/v1/attempt/
    attempt_payload_1 = {
        "userID": user_id,
        "questionID": question_id,
        "answerIDList": json.dumps([answer_id]),
    }
    attempt_resp_1 = requests.post(f"{BASE_URL}/api/v1/attempt/", headers={**headers_auth, "Content-Type": "application/json"}, json=attempt_payload_1, timeout=TIMEOUT)
    assert attempt_resp_1.status_code == 200, f"First attempt failed: {attempt_resp_1.text}"
    attempt_resp_1_data = attempt_resp_1.json()
    message_1 = attempt_resp_1_data.get("message", "").lower()
    assert "attempt created successfully" in message_1, f"Unexpected message on first attempt: {attempt_resp_1.text}"

    # Step 5: Make duplicate attempt with the same question and same answer
    attempt_payload_2 = {
        "userID": user_id,
        "questionID": question_id,
        "answerIDList": json.dumps([answer_id]),
    }
    attempt_resp_2 = requests.post(f"{BASE_URL}/api/v1/attempt/", headers={**headers_auth, "Content-Type": "application/json"}, json=attempt_payload_2, timeout=TIMEOUT)
    # Expect 400 with message 'You have already attempted this question!'
    assert attempt_resp_2.status_code == 400, f"Duplicate attempt did not fail as expected: {attempt_resp_2.text}"
    attempt_resp_2_data = attempt_resp_2.json()
    err_message = attempt_resp_2_data.get("message", "") or attempt_resp_2_data.get("error", "")
    assert "already attempted this question" in err_message.lower(), f"Unexpected error message: {attempt_resp_2.text}"

test_post_attempt_duplicate_question_attempt()
