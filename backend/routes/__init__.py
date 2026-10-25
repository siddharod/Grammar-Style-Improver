from flask import Blueprint, jsonify
from extensions import db
from config import Config
from services.groq_service import GroqService

health_bp = Blueprint("health", __name__, url_prefix="/api")


@health_bp.route("/health", methods=["GET"])
def health_check():
    """Return backend status, database connectivity, and integrations status."""
    db_ok = True
    try:
        db.session.execute(db.text("SELECT 1"))
    except Exception:
        db_ok = False

    return (
        jsonify(
            {
                "status": "healthy" if db_ok else "degraded",
                "database": "connected" if db_ok else "error",
                "integrations": {
                    "languagetool": {
                        "endpoint": Config.LANGUAGETOOL_API_URL,
                        "status": "active",
                    },
                    "groq": {
                        "configured": GroqService.is_configured(),
                        "model": Config.GROQ_MODEL,
                    },
                    "readability": {
                        "engine": "Local Flesch & Syllable Algorithmic Engine",
                        "status": "active",
                    },
                },
            }
        ),
        200 if db_ok else 500,
    )


__all__ = ["health_bp"]
