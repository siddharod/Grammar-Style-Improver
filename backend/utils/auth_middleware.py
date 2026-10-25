from functools import wraps
from flask import session, jsonify, g
from extensions import db
from models.user import User


def get_current_user():
    """Retrieve the currently authenticated User instance based on session."""
    user_id = session.get("user_id")
    if not user_id:
        return None
    if not hasattr(g, "current_user") or g.current_user is None:
        g.current_user = db.session.get(User, user_id)
    return g.current_user


def login_required(f):
    """Decorator to protect endpoints requiring session authentication."""

    @wraps(f)
    def decorated_function(*args, **kwargs):
        user_id = session.get("user_id")
        if not user_id:
            return (
                jsonify(
                    {
                        "success": False,
                        "error": "Authentication required. Please sign in to access this resource.",
                        "authenticated": False,
                    }
                ),
                401,
            )

        user = get_current_user()
        if not user:
            # Session exists but user was deleted or invalid
            session.clear()
            return (
                jsonify(
                    {
                        "success": False,
                        "error": "Session is invalid or expired. Please sign in again.",
                        "authenticated": False,
                    }
                ),
                401,
            )

        return f(*args, **kwargs)

    return decorated_function
