import requests
import time
import uuid

BASE_URL = "http://localhost:5000"
TIMEOUT = 30

def test_get_quiz_attempt_non_attemptable():
    # Step 1: Signup with a unique user to get user credentials and tokens
    timestamp = int(time.time() * 1000)
    test_email = f"testuser_{timestamp}@test.com"
    signup_payload = {
        "name": "Test User",
        "email": test_email,
        "password": "TestPass123!",
        "agreedTermsOfService": True
    }

    try:
        signup_resp = requests.post(
            f"{BASE_URL}/api/v1/user/auth/signup",
            json=signup_payload,
            timeout=TIMEOUT
        )
        assert signup_resp.status_code == 201, f"Signup failed: {signup_resp.text}"
        signup_data = signup_resp.json()
        access_token = signup_data.get("accessToken")
        refresh_token = signup_data.get("refreshToken")
        user = signup_data.get("user")
        assert access_token is not None, "No accessToken in signup response"
        assert user is not None and "id" in user, "No user id in signup response"

        headers = {"Authorization": f"Bearer {access_token}"}

        # Step 2: Get list of all quizzes (any quiz) using authorized user (non-admin)
        get_quiz_resp = requests.get(f"{BASE_URL}/api/v1/quiz/", headers=headers, timeout=TIMEOUT)
        assert get_quiz_resp.status_code == 200, f"Failed to get quizzes: {get_quiz_resp.text}"

        quiz_resp_data = get_quiz_resp.json()
        assert isinstance(quiz_resp_data, dict), "Quizzes response is not an object"
        assert quiz_resp_data.get("status") == "success", "Quizzes response status is not 'success'"
        quiz_list = quiz_resp_data.get("data")
        assert isinstance(quiz_list, list), "Quizzes response 'data' is not a list"

        if not quiz_list:
            # No quizzes found, cannot proceed with test as no quiz to test non-attemptable
            # Skip test with assertion
            assert False, "No quizzes available to test non-attemptable quiz attempt"

        # Step 3: Find a quiz that is not attemptable
        # Since the schema does not detail attemptable flag, assume a quiz with startsAt/endAt outside valid range is non-attemptable
        # We'll attempt all quizzes until we find one that returns 400 with 'Quiz not attemptable' or pick the first quiz and test it.

        # We'll pick the first quiz to test
        quiz = quiz_list[0]
        quiz_id = quiz.get("id")
        assert quiz_id, "Quiz does not have id"

        # Step 4: Call GET /api/v1/quiz/attempt/:id with that quiz ID
        resp = requests.get(f"{BASE_URL}/api/v1/quiz/attempt/{quiz_id}", headers=headers, timeout=TIMEOUT)

        # Step 5: If quiz is attemptable, we expect 200 but test requires testing non-attemptable quiz returns 400
        # So if status_code is 200, try next quiz if any or fail test
        if resp.status_code == 400:
            data = resp.json()
            message = data.get("message") or data.get("error") or ""
            assert "Quiz not attemptable" in message, f"Expected 'Quiz not attemptable' message, got '{message}'"
        elif resp.status_code == 200:
            # Means quiz is attemptable, try other quizzes if any
            found_non_attemptable = False
            for quiz in quiz_list[1:]:
                quiz_id = quiz.get("id")
                if not quiz_id:
                    continue
                resp_try = requests.get(f"{BASE_URL}/api/v1/quiz/attempt/{quiz_id}", headers=headers, timeout=TIMEOUT)
                if resp_try.status_code == 400:
                    data = resp_try.json()
                    message = data.get("message") or data.get("error") or ""
                    if "Quiz not attemptable" in message:
                        found_non_attemptable = True
                        break
            assert found_non_attemptable, "No non-attemptable quiz found in quiz list to return 400 with 'Quiz not attemptable'"
        else:
            assert False, f"Unexpected status code {resp.status_code} received when requesting quiz attempt"

    except requests.RequestException as e:
        assert False, f"Request failed: {str(e)}"

test_get_quiz_attempt_non_attemptable()
