import requests
import time

BASE_URL = "http://localhost:5000"
TIMEOUT = 30


def test_TC013_update_attempt_duration():
    # Step 1: Sign up a new user
    timestamp = str(int(time.time() * 1000))
    signup_email = f"testuser_{timestamp}@test.com"
    signup_payload = {
        "name": "Test User",
        "email": signup_email,
        "password": "TestPassword123!",
        "agreedTermsOfService": True
    }
    signup_resp = requests.post(
        f"{BASE_URL}/api/v1/user/auth/signup",
        json=signup_payload,
        timeout=TIMEOUT
    )
    assert signup_resp.status_code == 201, f"Signup failed: {signup_resp.text}"
    signup_data = signup_resp.json()
    assert "accessToken" in signup_data, "accessToken missing in signup response"
    assert "refreshToken" in signup_data, "refreshToken missing in signup response"
    assert "user" in signup_data and "id" in signup_data["user"], "User ID missing in signup response"
    access_token = signup_data["accessToken"]
    user_id = signup_data["user"]["id"]

    # Step 2: Get quizzes list to obtain a valid quizID (authenticated user, no admin needed)
    headers = {"Authorization": f"Bearer {access_token}"}
    get_quizzes_resp = requests.get(
        f"{BASE_URL}/api/v1/quiz/",
        headers=headers,
        timeout=TIMEOUT
    )
    assert get_quizzes_resp.status_code == 200, f"Failed to get quizzes: {get_quizzes_resp.text}"
    quizzes = get_quizzes_resp.json()
    quiz_list = []
    if isinstance(quizzes, dict):
        if "data" in quizzes and isinstance(quizzes["data"], list):
            quiz_list = quizzes["data"]
        elif "quizzes" in quizzes and isinstance(quizzes["quizzes"], list):
            quiz_list = quizzes["quizzes"]
        else:
            for v in quizzes.values():
                if isinstance(v, list):
                    quiz_list = v
                    break
    elif isinstance(quizzes, list):
        quiz_list = quizzes

    assert quiz_list, "No quizzes found to test PATCH /attemptduration"

    quiz_id = quiz_list[0].get("id") or quiz_list[0].get("quizID") or quiz_list[0].get("quizId")
    assert quiz_id is not None, "Quiz ID not found in quizzes response"

    # Step 3: PATCH /api/v1/attemptduration/quiz/:quizID with valid payload
    patch_url = f"{BASE_URL}/api/v1/attemptduration/quiz/{quiz_id}"
    patch_payload = {
        "userID": user_id,
        "duration": 120
    }
    patch_resp = requests.patch(
        patch_url,
        headers={**headers, "Content-Type": "application/json"},
        json=patch_payload,
        timeout=TIMEOUT
    )
    assert patch_resp.status_code == 200, f"Expected 200 OK but got {patch_resp.status_code}: {patch_resp.text}"
    patch_json = patch_resp.json()

    # Check if response has 'data' wrapping
    if isinstance(patch_json, dict) and 'data' in patch_json and isinstance(patch_json['data'], dict):
        data_obj = patch_json['data']
    else:
        data_obj = patch_json

    # Validate Expected fields in updated AttemptDuration object
    assert isinstance(data_obj, dict), "PATCH response data is not a JSON object"

    # Accept quizID field in any casing
    quiz_id_keys = ["quizID", "quizId", "quiz_id"]
    user_id_keys = ["userID", "userId", "user_id"]
    duration_key = "duration"

    resp_quiz_id = None
    for key in quiz_id_keys:
        if key in data_obj:
            resp_quiz_id = data_obj[key]
            break
    assert resp_quiz_id is not None, "quizID missing in response"

    resp_user_id = None
    for key in user_id_keys:
        if key in data_obj:
            resp_user_id = data_obj[key]
            break
    assert resp_user_id is not None, "userID missing in response"

    assert duration_key in data_obj, "duration field missing in response"
    assert isinstance(data_obj[duration_key], int), "duration field is not integer"
    assert data_obj[duration_key] == 120, f"duration field value mismatch. Expected 120 got {data_obj[duration_key]}"

    assert resp_quiz_id == quiz_id, f"Response quizID ({resp_quiz_id}) does not match request quizID ({quiz_id})"
    assert resp_user_id == user_id, f"Response userID ({resp_user_id}) does not match request userID ({user_id})"


test_TC013_update_attempt_duration()
