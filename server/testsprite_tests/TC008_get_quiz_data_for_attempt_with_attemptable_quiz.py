import requests
import time
import uuid

BASE_URL = "http://localhost:5000"
TIMEOUT = 30


def test_get_quiz_data_for_attempt_with_attemptable_quiz():
    # Step 1: Sign up a fresh user to get credentials
    signup_url = f"{BASE_URL}/api/v1/user/auth/signup"
    unique_email = f"testuser_{int(time.time() * 1000)}@test.com"
    signup_payload = {
        "name": "Test User",
        "email": unique_email,
        "password": "TestPassword123!",
        "agreedTermsOfService": True
    }
    try:
        signup_resp = requests.post(signup_url, json=signup_payload, timeout=TIMEOUT)
        assert signup_resp.status_code == 201, f"Signup failed: {signup_resp.text}"
        signup_data = signup_resp.json()
        access_token = signup_data.get("accessToken")
        refresh_token = signup_data.get("refreshToken")
        user = signup_data.get("user")
        assert access_token and user and "id" in user, "Invalid signup response data"
        user_id = user["id"]

        # Step 2: Get all quizzes (GET /api/v1/quiz/) with Bearer token (user token, non-admin)
        quizzes_url = f"{BASE_URL}/api/v1/quiz/"
        headers = {
            "Authorization": f"Bearer {access_token}"
        }
        quizzes_resp = requests.get(quizzes_url, headers=headers, timeout=TIMEOUT)
        assert quizzes_resp.status_code == 200, f"Failed to get quizzes: {quizzes_resp.text}"
        quizzes_data = quizzes_resp.json()
        assert isinstance(quizzes_data, dict), "Quizzes response not dict"
        quizzes_list = quizzes_data.get("data") or quizzes_data.get("quizzes") or []
        if not quizzes_list:
            # No quizzes available to test with
            raise AssertionError("No quizzes available for the test")

        # Step 3: Find an attemptable quiz - get first quiz that has startsAt <= now < endsAt
        # and is attemptable (we assume any quiz returned here is attemptable per instructions)
        # We'll pick the first quiz and use its ID
        attemptable_quiz = None
        now_iso = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        for quiz in quizzes_list:
            starts_at = quiz.get("startsAt")
            ends_at = quiz.get("endsAt")
            # Simple check on timestamps as strings assuming ISO8601 UTC format ending with Z
            if starts_at and ends_at and starts_at <= now_iso <= ends_at:
                attemptable_quiz = quiz
                break
        if not attemptable_quiz:
            # fallback to first quiz if none match time condition
            attemptable_quiz = quizzes_list[0]

        quiz_id = attemptable_quiz.get("id")
        assert quiz_id, "Selected quiz does not have an id"

        # Step 4: GET /api/v1/quiz/attempt/:id with Bearer token to get attempt data
        attempt_url = f"{BASE_URL}/api/v1/quiz/attempt/{quiz_id}"
        attempt_resp = requests.get(attempt_url, headers=headers, timeout=TIMEOUT)
        assert attempt_resp.status_code == 200, f"Failed to get attempt quiz data: {attempt_resp.text}"
        attempt_data = attempt_resp.json()
        assert isinstance(attempt_data, dict), "Attempt data response not a dict"

        # Validate presence of quiz questions and answers without "isCorrect" fields
        # Expect attempt_data structure to contain questions array with answers array,
        # and no "isCorrect" field in answers
        questions = attempt_data.get("questions") or attempt_data.get("data", {}).get("questions")
        if questions is None:
            # Maybe questions under data or top-level questions
            raise AssertionError("Response missing 'questions' field")

        assert isinstance(questions, list), "'questions' is not a list"

        # Check each question has answers and answers do NOT have 'isCorrect' field
        for question in questions:
            answers = question.get("answers")
            assert isinstance(answers, list), "Question's answers is not a list"
            for answer in answers:
                assert "isCorrect" not in answer, "'isCorrect' field should be sanitized from answers"

    except Exception:
        raise


test_get_quiz_data_for_attempt_with_attemptable_quiz()