from flask import Blueprint, request, jsonify, session
from services.groq_service import GroqService
from config import Config
from utils.errors import error_response

chat_bp = Blueprint("chat", __name__, url_prefix="/api/chat")


@chat_bp.route("", methods=["POST"], strict_slashes=False)
@chat_bp.route("/", methods=["POST"])
def send_chat_message():
    """
    Handle conversation messages for the AI Writing Assistant.
    Validates input and securely proxies through the server-side Groq integration.
    """
    data = request.get_json(silent=True)
    if not data or not isinstance(data, dict):
        return error_response("Invalid request format. Expected JSON body.", 400)

    messages = data.get("messages")
    if not messages or not isinstance(messages, list):
        return error_response("A non-empty 'messages' list is required.", 400)

    # Optional temperature customization
    temperature = data.get("temperature", 0.5)
    try:
        temperature = float(temperature)
        temperature = max(0.0, min(1.0, temperature))
    except (ValueError, TypeError):
        temperature = 0.5

    result = GroqService.chat_conversation(messages=messages, temperature=temperature)

    if not result.get("success"):
        status_code = result.get("status_code", 500)
        return jsonify(result), status_code

    return jsonify(result), 200


@chat_bp.route("/status", methods=["GET"], strict_slashes=False)
def chat_status():
    """Return live availability status for the AI assistant without exposing API keys."""
    configured = GroqService.is_configured()
    return jsonify(
        {
            "success": True,
            "available": configured,
            "provider": "Groq Cloud API",
            "model": Config.GROQ_MODEL if configured else None,
        }
    ), 200
