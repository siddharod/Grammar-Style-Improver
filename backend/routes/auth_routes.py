from flask import Blueprint, request, session, jsonify
from extensions import db
from models.user import User
from utils.validation import validate_registration_data, validate_login_data
from utils.errors import error_response, success_response
from utils.auth_middleware import login_required, get_current_user

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@auth_bp.route("/register", methods=["POST"])
def register():
    """Register a new user account."""
    data = request.get_json(silent=True)
    is_valid, err_msg = validate_registration_data(data)
    if not is_valid:
        return error_response(err_msg, 400)

    name = data["name"].strip()
    email = data["email"].strip().lower()
    password = data["password"]

    # Check for duplicate email address
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return error_response("An account with this email address already exists.", 409)

    user = User(name=name, email=email)
    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    # Establish authenticated session
    session.clear()
    session["user_id"] = user.id

    return jsonify({"success": True, "user": user.to_dict(), "message": "Account created successfully."}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    """Authenticate user with email and password."""
    data = request.get_json(silent=True)
    is_valid, err_msg = validate_login_data(data)
    if not is_valid:
        return error_response(err_msg, 400)

    email = data["email"].strip().lower()
    password = data["password"]

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return error_response("Invalid email or password.", 401)

    # Establish authenticated session
    session.clear()
    session["user_id"] = user.id

    return jsonify({"success": True, "user": user.to_dict(), "message": "Logged in successfully."}), 200


@auth_bp.route("/logout", methods=["POST"])
def logout():
    """Clear session authentication."""
    session.clear()
    return jsonify({"success": True, "message": "Logged out successfully."}), 200


@auth_bp.route("/me", methods=["GET"])
def me():
    """Return currently authenticated user profile."""
    user = get_current_user()
    if not user:
        return jsonify({"success": False, "authenticated": False, "error": "Not authenticated."}), 401

    return jsonify({"success": True, "authenticated": True, "user": user.to_dict()}), 200
