import requests
import time
import uuid

BASE_URL = "http://localhost:5000"
TIMEOUT = 30

def test_claim_quiz_sats_reward_completed_quiz():
    # Step 1: Signup a new user
    signup_email = f"testuser_{int(time.time()*1000)}@test.com"
    signup_payload = {
        "name": "Test User",
        "email": signup_email,
        "password": "TestPass123!",
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
    refresh_token = signup_data.get("refreshToken")
    user = signup_data.get("user")
    assert access_token and refresh_token and user, "Missing tokens or user in signup response"
    user_id = user.get("id")
    assert user_id, "Missing user.id"

    headers = {"Authorization": f"Bearer {access_token}"}

    # Step 2: Get quizzes list to have valid quizID
    quizzes_resp = requests.get(
        f"{BASE_URL}/api/v1/quiz/",
        headers=headers,
        timeout=TIMEOUT
    )
    assert quizzes_resp.status_code == 200, f"Failed to get quizzes: {quizzes_resp.text}"
    quizzes_data = quizzes_resp.json()
    quizzes = quizzes_data if isinstance(quizzes_data, list) else quizzes_data.get("data", [])
    assert quizzes and isinstance(quizzes, list), "No quizzes found or invalid format"
    quiz = quizzes[0]
    quiz_id = quiz.get("id")
    assert quiz_id, "Invalid quiz id"

    # Step 3: Add a sats reward address (verified default Lightning address) for user
    address_payload = {
        "userID": user_id,
        "address": f"testaddress_{uuid.uuid4().hex}@ln.tips"
    }
    address_resp = requests.post(
        f"{BASE_URL}/api/v1/satsreward/address",
        json=address_payload,
        headers=headers,
        timeout=TIMEOUT
    )
    assert address_resp.status_code == 201, f"Failed to add sats reward address: {address_resp.text}"
    address_data = address_resp.json()
    # Ensure address_data is a dict before using get
    if isinstance(address_data, dict):
        satsreward_address = address_data.get("data", address_data) if "data" in address_data else address_data
    else:
        satsreward_address = {}
    satsreward_address_id = satsreward_address.get("id") if isinstance(satsreward_address, dict) else None

    try:
        # Step 4: Simulate completion of quiz by the user
        # Because no direct API to mark quiz completed, simulate by posting an attempt with answers for quiz
        # We need to get at least one question and its correct answer for the quiz

        # 4a: Get attemptable quiz details (questions + answers, sanitized)
        attempt_resp = requests.get(
            f"{BASE_URL}/api/v1/quiz/attempt/{quiz_id}",
            headers=headers,
            timeout=TIMEOUT
        )
        assert attempt_resp.status_code == 200, f"Failed to get quiz attempt data: {attempt_resp.text}"
        attempt_data = attempt_resp.json()
        questions = attempt_data.get("questions") or attempt_data.get("data") or []
        if not questions:
            # if top-level is list instead of wrapper dict
            questions = attempt_data if isinstance(attempt_data, list) else []

        assert questions, "No questions retrieved for quiz"

        # For each question, submit an attempt with correct answer(s)
        for question in questions:
            question_id = question.get("id") or question.get("uuid") or question.get("questionID")
            assert question_id, "Missing question id"
            answers = question.get("answers") or []
            assert answers, "No answers for question"

            # Find correct answers
            # Since correct answers are sanitized out for student, we cannot rely on isCorrect field
            # We'll just select the first answer to simulate an attempt
            first_answer = answers[0]
            answer_id = first_answer.get("id") or first_answer.get("uuid") or first_answer.get("answerID")
            assert answer_id, "Missing answer id"

            attempt_payload = {
                "userID": user_id,
                "questionID": question_id,
                "answerIDList": f'["{answer_id}"]'
            }
            attempt_post_resp = requests.post(
                f"{BASE_URL}/api/v1/attempt/",
                json=attempt_payload,
                headers=headers,
                timeout=TIMEOUT
            )
            # We accept 200 or 400 if attempt already exists (idempotent)
            assert attempt_post_resp.status_code in (200, 400), f"Attempt post failed: {attempt_post_resp.text}"
            if attempt_post_resp.status_code == 400:
                json_err = attempt_post_resp.json()
                err_msg = json_err.get("message") or json_err.get("error") or ""
                assert err_msg == "You have already attempted this question!" or err_msg == "Please provide an answer!", f"Unexpected error: {err_msg}"
            else:
                success_msg = attempt_post_resp.json().get("message")
                assert success_msg == "Attempt created successfully!", f"Unexpected success message: {success_msg}"

        # Step 5: POST /api/v1/satsreward/claim-quiz with userID and quizID
        claim_payload = {
            "userID": user_id,
            "quizID": quiz_id
        }
        claim_resp = requests.post(
            f"{BASE_URL}/api/v1/satsreward/claim-quiz",
            json=claim_payload,
            headers=headers,
            timeout=TIMEOUT
        )
        assert claim_resp.status_code == 201, f"Claim quiz sats reward failed: {claim_resp.text}"
        claim_data = claim_resp.json()
        # Validate response contains expected sats reward record info
        assert ("status" in claim_data and claim_data["status"] == "success") or ("data" in claim_data), "Unexpected claim quiz response format"
        if isinstance(claim_data, dict):
            sats_reward = claim_data.get("data") or claim_data
        else:
            assert False, "Claim response JSON is not a dict"
        assert isinstance(sats_reward, dict), "Sats reward record is not a dict"
        assert sats_reward.get("userID") == user_id, "Returned sats reward userID mismatch"
        assert sats_reward.get("quizID") == quiz_id, "Returned sats reward quizID mismatch"
        assert "id" in sats_reward, "Missing id in sats reward record"

    finally:
        # Cleanup: remove the sats reward address
        if satsreward_address_id:
            try:
                requests.delete(
                    f"{BASE_URL}/api/v1/satsreward/address/{satsreward_address_id}",
                    headers=headers,
                    timeout=TIMEOUT
                )
            except Exception:
                pass

test_claim_quiz_sats_reward_completed_quiz()
