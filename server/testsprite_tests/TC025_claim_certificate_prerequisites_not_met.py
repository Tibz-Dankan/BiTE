import requests
import time
import uuid

BASE_URL = "http://localhost:5000"
TIMEOUT = 30


def get_admin_token_and_user_id():
    # Admin credentials must exist; assuming known admin email/password
    admin_email = "admin@example.com"
    admin_password = "AdminPass123!"

    signin_payload = {
        "email": admin_email,
        "password": admin_password
    }
    signin_resp = requests.post(
        f"{BASE_URL}/api/v1/user/auth/signin",
        json=signin_payload,
        timeout=TIMEOUT
    )
    assert signin_resp.status_code == 200, f"Admin signin failed: {signin_resp.text}"
    signin_data = signin_resp.json()
    assert "accessToken" in signin_data and "user" in signin_data
    return signin_data["accessToken"], signin_data["user"]["id"]


def test_claim_certificate_prerequisites_not_met():
    # Step 1: Sign up a new user to get credentials and userID
    timestamp = int(time.time() * 1000)
    test_email = f"testuser_{timestamp}@test.com"
    signup_payload = {
        "name": "Test User",
        "email": test_email,
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
    assert "accessToken" in signup_data and "refreshToken" in signup_data and "user" in signup_data
    access_token = signup_data["accessToken"]
    user_id = signup_data["user"]["id"]

    # Step 2: Get admin token to create a category certificate
    admin_access_token, admin_user_id = get_admin_token_and_user_id()

    # Create a category certificate with dummy data
    category_certificate_payload = {
        "quizCategoryID": str(uuid.uuid4()),  # assuming this is acceptable dummy
        "quizIDs": [str(uuid.uuid4()), str(uuid.uuid4())]  # dummy quizzes
    }

    headers_admin = {
        "Authorization": f"Bearer {admin_access_token}",
        "Content-Type": "application/json"
    }

    create_cert_resp = requests.post(
        f"{BASE_URL}/api/v1/certificate/",
        headers=headers_admin,
        json=category_certificate_payload,
        timeout=TIMEOUT
    )

    assert create_cert_resp.status_code == 201, f"Certificate creation failed: {create_cert_resp.text}"
    create_cert_data = create_cert_resp.json()
    category_certificate_id = create_cert_data.get("id") or create_cert_data.get("data", {}).get("id")
    assert category_certificate_id is not None, "Created certificate missing 'id'"

    # Step 3: User attempts to claim the certificate without completing prerequisites
    headers_user = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    claim_payload = {
        "userID": user_id,
        "categoryCertificateID": category_certificate_id
    }

    claim_resp = requests.post(
        f"{BASE_URL}/api/v1/certificate/claim",
        headers=headers_user,
        json=claim_payload,
        timeout=TIMEOUT
    )

    # The expected result is HTTP 400 with message 'User has not completed all required quizzes'
    assert claim_resp.status_code == 400, f"Expected 400 but got {claim_resp.status_code}: {claim_resp.text}"
    try:
        resp_json = claim_resp.json()
        message = resp_json.get("message", "") or resp_json.get("error", "")
        assert "User has not completed all required quizzes" in message
    except Exception:
        # If response is not JSON or missing message, fail
        assert False, f"Response JSON parsing failed or missing message: {claim_resp.text}"


test_claim_certificate_prerequisites_not_met()