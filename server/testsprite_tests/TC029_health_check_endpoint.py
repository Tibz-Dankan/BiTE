import requests

BASE_URL = "http://localhost:5000"
TIMEOUT = 30


def test_health_check_endpoint():
    url = f"{BASE_URL}/health"
    try:
        response = requests.get(url, timeout=TIMEOUT)
        assert response.status_code == 200, f"Expected status 200 but got {response.status_code}"
        json_data = response.json()
        # Expect the response to include health status keys, e.g., "status", "uptime", or similar
        # We check for 'status' key presence for health indication
        assert "status" in json_data, "Response JSON missing 'status' field"
        # Optionally check the status value is 'ok' or 'healthy' if common convention
        assert json_data["status"].lower() in ["ok", "healthy", "up", "success"], f"Unexpected health status value: {json_data['status']}"
    except requests.RequestException as e:
        assert False, f"HTTP request failed: {e}"
    except ValueError:
        assert False, "Response is not valid JSON"


test_health_check_endpoint()