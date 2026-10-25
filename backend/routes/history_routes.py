from flask import Blueprint, jsonify, session
from extensions import db
from models.analysis import Analysis
from utils.auth_middleware import login_required
from utils.errors import error_response

history_bp = Blueprint("history", __name__, url_prefix="/api/history")


@history_bp.route("", methods=["GET"])
@login_required
def get_history():
    """Retrieve all analysis records belonging to the authenticated user."""
    user_id = session.get("user_id")
    records = (
        Analysis.query.filter_by(user_id=user_id)
        .order_by(Analysis.created_at.desc())
        .all()
    )
    return (
        jsonify({"success": True, "history": [record.to_dict() for record in records]}),
        200,
    )


@history_bp.route("/<int:record_id>", methods=["GET"])
@login_required
def get_single_record(record_id: int):
    """Retrieve one specific analysis record belonging to the authenticated user."""
    user_id = session.get("user_id")
    record = Analysis.query.filter_by(id=record_id, user_id=user_id).first()

    if not record:
        return error_response(
            "Analysis record not found or you do not have permission to view it.", 404
        )

    return jsonify({"success": True, "analysis": record.to_dict()}), 200


@history_bp.route("/<int:record_id>", methods=["DELETE"])
@login_required
def delete_single_record(record_id: int):
    """Delete one specific analysis record belonging to the authenticated user."""
    user_id = session.get("user_id")
    record = Analysis.query.filter_by(id=record_id, user_id=user_id).first()

    if not record:
        return error_response(
            "Analysis record not found or you do not have permission to delete it.", 404
        )

    db.session.delete(record)
    db.session.commit()

    return (
        jsonify(
            {
                "success": True,
                "message": "Analysis record deleted successfully.",
                "deleted_id": str(record_id),
            }
        ),
        200,
    )
