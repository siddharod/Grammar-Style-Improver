import json
from models.user import User


def test_health_endpoint(client):
    """Test health check route."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.get_json()
    assert data["status"] == "healthy"
    assert data["database"] == "connected"
    assert "integrations" in data


def test_successful_registration(client, app):
    """Test user registration with valid inputs."""
    payload = {
        "name": "Jane Researcher",
        "email": "jane.researcher@institute.edu",
        "password": "SecurePassword123!",
    }
    response = client.post("/api/auth/register", json=payload)
    assert response.status_code == 201
    data = response.get_json()
    assert data["success"] is True
    assert data["user"]["name"] == "Jane Researcher"
    assert data["user"]["email"] == "jane.researcher@institute.edu"
    assert "password" not in data["user"]
    assert "password_hash" not in data["user"]

    # Verify password was hashed in database
    with app.app_context():
        user = User.query.filter_by(email="jane.researcher@institute.edu").first()
        assert user is not None
        assert user.password_hash != "SecurePassword123!"
        assert user.check_password("SecurePassword123!") is True


def test_registration_duplicate_email(client, auth_user):
    """Test that duplicate email registration returns 409 Conflict."""
    payload = {
        "name": "Another Name",
        "email": auth_user["email"],
        "password": "Password999!",
    }
    response = client.post("/api/auth/register", json=payload)
    assert response.status_code == 409
    data = response.get_json()
    assert data["success"] is False
    assert "already exists" in data["error"].lower()


def test_registration_validation_errors(client):
    """Test registration with missing or invalid fields."""
    # Short password
    res1 = client.post(
        "/api/auth/register",
        json={"name": "Alice", "email": "alice@test.com", "password": "123"},
    )
    assert res1.status_code == 400

    # Invalid email
    res2 = client.post(
        "/api/auth/register",
        json={"name": "Alice", "email": "invalid-email", "password": "ValidPassword123"},
    )
    assert res2.status_code == 400

    # Empty name
    res3 = client.post(
        "/api/auth/register",
        json={"name": "", "email": "alice@test.com", "password": "ValidPassword123"},
    )
    assert res3.status_code == 400


def test_successful_login_and_me(client, auth_user):
    """Test login and subsequent /me profile retrieval using session cookie."""
    login_res = client.post(
        "/api/auth/login",
        json={"email": auth_user["email"], "password": auth_user["password"]},
    )
    assert login_res.status_code == 200
    data = login_res.get_json()
    assert data["success"] is True
    assert data["user"]["email"] == auth_user["email"]

    # Verify session via /api/auth/me
    me_res = client.get("/api/auth/me")
    assert me_res.status_code == 200
    me_data = me_res.get_json()
    assert me_data["success"] is True
    assert me_data["authenticated"] is True
    assert me_data["user"]["email"] == auth_user["email"]


def test_login_invalid_credentials(client, auth_user):
    """Test login rejection with incorrect password."""
    res = client.post(
        "/api/auth/login",
        json={"email": auth_user["email"], "password": "WrongPassword!"},
    )
    assert res.status_code == 401
    data = res.get_json()
    assert data["success"] is False
    assert "invalid email or password" in data["error"].lower()


def test_logout(logged_in_client):
    """Test that logout clears session and subsequent protected calls fail."""
    # Verify currently logged in
    me_before = logged_in_client.get("/api/auth/me")
    assert me_before.status_code == 200

    # Logout
    logout_res = logged_in_client.post("/api/auth/logout")
    assert logout_res.status_code == 200

    # Verify no longer logged in
    me_after = logged_in_client.get("/api/auth/me")
    assert me_after.status_code == 401


def test_unauthenticated_protected_endpoint(client):
    """Test that unauthorized request to protected endpoint returns 401."""
    res = client.get("/api/history")
    assert res.status_code == 401
    data = res.get_json()
    assert data["success"] is False
    assert data["authenticated"] is False
