from flask import Blueprint, request, jsonify, session
from utils.auth_middleware import login_required
from utils.validation import validate_analysis_input
from utils.errors import error_response
from services.analysis_service import AnalysisService

analysis_bp = Blueprint("analysis", __name__, url_prefix="/api")


@analysis_bp.route("/analyze", methods=["POST"])
@login_required
def analyze_text():
    """Execute complete analysis suite for submitted text."""
    data = request.get_json(silent=True)
    is_valid, err_msg, cleaned_text, target_tone, language = validate_analysis_input(data)
    if not is_valid:
        return error_response(err_msg, 400)

    user_id = session.get("user_id")

    try:
        result = AnalysisService.execute_analysis(
            user_id=user_id,
            text=cleaned_text,
            target_tone=target_tone,
            language=language,
        )
        return jsonify({"success": True, "analysis": result}), 200

    except Exception as e:
        return error_response(f"Analysis processing error: {str(e)}", 500)
