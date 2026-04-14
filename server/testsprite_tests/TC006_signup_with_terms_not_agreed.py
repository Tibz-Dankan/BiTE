import requests
import time

def test_signup_with_terms_not_agreed():
    base_url = "http://localhost:5000"
    url = f"{base_url}/api/v1/user/auth/signup"
    timestamp = int(time.time() * 1000)
    unique_email = f"testuser_{timestamp}@test.com"

    payload = {
        "name": "Test User",
        "email": unique_email,
        "password": "TestPassword123!",
        "agreedTermsOfService": False
    }
    headers = {
        "Content-Type": "application/json"
    }
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=30)
    except requests.RequestException as e:
        assert False, f"Request failed: {e}"

    assert response.status_code == 400, f"Expected status code 400 but got {response.status_code}"
    try:
        resp_json = response.json()
    except ValueError:
        assert False, "Response is not valid JSON"

    # Expect message about agreeing to terms
    msg = resp_json.get("message", "").lower()
    assert "terms" in msg or "agree" in msg or "agreedTermsOfService" in msg, f"Expected error message about agreeing to terms, got: {resp_json.get('message')}"
    
test_signup_with_terms_not_agreed()