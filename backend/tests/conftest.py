import sys
from pathlib import Path
import pytest

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from app import create_app
from config import TestConfig
from extensions import db
from models.user import User


@pytest.fixture
def app():
    """Create and configure a testing Flask application with in-memory database."""
    test_app = create_app(TestConfig)

    with test_app.app_context():
        db.create_all()
        yield test_app
        db.session.remove()
        db.drop_all()


@pytest.fixture
def client(app):
    """Test client with cookie jar support."""
    return app.test_client()


@pytest.fixture
def auth_user(app):
    """Create a verified test user."""
    with app.app_context():
        user = User(
            name="Test Scholar",
            email="scholar@university.edu",
        )
        user.set_password("Password123!")
        db.session.add(user)
        db.session.commit()
        return {"id": user.id, "email": user.email, "name": user.name, "password": "Password123!"}


@pytest.fixture
def logged_in_client(client, auth_user):
    """Client already logged in with session cookie."""
    client.post(
        "/api/auth/login",
        json={"email": auth_user["email"], "password": auth_user["password"]},
    )
    return client
