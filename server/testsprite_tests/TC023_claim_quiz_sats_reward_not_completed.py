import requests
import time
import uuid

BASE_URL = "http://localhost:5000"
TIMEOUT = 30


def test_claim_quiz_sats_reward_not_completed():
    # Step 1: Signup to create a fresh user
    unique_email = f"testuser_{int(time.time()*1000)}@test.com"
    signup_payload = {
        "name": "Test User",
        "email": unique_email,
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
    user = signup_data.get("user")
    assert access_token and user, "Signup response missing required fields"
    user_id = user.get("id")
    assert user_id, "User ID missing in signup response"

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    # Step 1a: Create and verify a Lightning address for the user to satisfy precondition
    lightning_address_payload = {
        "userID": user_id,
        "address": f"ln_test_address_{uuid.uuid4()}"
    }
    addr_resp = requests.post(
        f"{BASE_URL}/api/v1/satsreward/address",
        headers=headers,
        json=lightning_address_payload,
        timeout=TIMEOUT
    )
    assert addr_resp.status_code == 201, f"Creating lightning address failed: {addr_resp.text}"
    addr_data = addr_resp.json()
    address_id = addr_data.get("id") or addr_data.get("data", {}).get("id")
    assert address_id, "Created address ID missing"

    # Step 1b: Set the created address as the default
    patch_resp = requests.patch(
        f"{BASE_URL}/api/v1/satsreward/address/{address_id}/default",
        headers=headers,
        timeout=TIMEOUT
    )
    assert patch_resp.status_code == 200, f"Setting default address failed: {patch_resp.text}"

    # Step 2: Fetch quizzes to get a quiz ID to claim
    get_quizzes_resp = requests.get(
        f"{BASE_URL}/api/v1/quiz/",
        headers=headers,
        timeout=TIMEOUT
    )
    assert get_quizzes_resp.status_code == 200, f"Get quizzes failed: {get_quizzes_resp.text}"
    quizzes_data = get_quizzes_resp.json()
    quizzes = quizzes_data if isinstance(quizzes_data, list) else quizzes_data.get("data") or []
    assert isinstance(quizzes, list), "Quizzes data is not a list"
    assert quizzes, "No quizzes available to test claiming sats reward"

    quiz_id = None
    for q in quizzes:
        qid = q.get("id") or q.get("quizID") or q.get("uuid")
        if qid and isinstance(qid, str) and len(qid) > 5:
            quiz_id = qid
            break
    assert quiz_id, "No valid quiz ID found in quizzes list"

    claim_payload = {
        "userID": user_id,
        "quizID": quiz_id
    }

    claim_resp = requests.post(
        f"{BASE_URL}/api/v1/satsreward/claim-quiz",
        headers=headers,
        json=claim_payload,
        timeout=TIMEOUT
    )

    # Expect 400 with message 'Quiz not completed by user'
    assert claim_resp.status_code == 400, f"Expected 400, got {claim_resp.status_code}: {claim_resp.text}"
    resp_json = claim_resp.json()
    message = resp_json.get("message") or resp_json.get("error") or ""
    assert "Quiz not completed by user" in message, f"Unexpected error message: {message}"


test_claim_quiz_sats_reward_not_completed()