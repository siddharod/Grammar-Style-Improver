from datetime import datetime, timezone
from extensions import db


class Analysis(db.Model):
    """Analysis model persisting grammar, readability, tone, and rewrite results."""

    __tablename__ = "analyses"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(
        db.Integer, db.ForeignKey("users.id"), nullable=False, index=True
    )
    title = db.Column(db.String(200), nullable=False)
    original_text = db.Column(db.Text, nullable=False)
    target_tone = db.Column(db.String(50), default="Professional", nullable=False)

    # Structured JSON results
    grammar_results = db.Column(db.JSON, nullable=False, default=list)
    readability_results = db.Column(db.JSON, nullable=False, default=dict)
    tone_results = db.Column(db.JSON, nullable=False, default=list)
    improved_text = db.Column(db.Text, nullable=True)
    writing_suggestions = db.Column(db.JSON, nullable=False, default=list)
    provider_used = db.Column(
        db.String(100), default="Groq + LanguageTool", nullable=False
    )
    module_status = db.Column(db.JSON, nullable=True, default=dict)

    created_at = db.Column(
        db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )

    def to_dict(self) -> dict:
        """Convert record to format expected by the frontend AnalysisRecord."""
        return {
            "id": str(self.id),
            "userId": str(self.user_id),
            "title": self.title,
            "originalText": self.original_text,
            "improvedText": self.improved_text or self.original_text,
            "targetTone": self.target_tone,
            "detectedTones": self.tone_results or [],
            "metrics": self.readability_results or {},
            "issues": self.grammar_results or [],
            "suggestions": self.writing_suggestions or [],
            "providerUsed": self.provider_used,
            "moduleStatus": self.module_status or {},
            "createdAt": self.created_at.isoformat() if self.created_at else "",
        }

    def __repr__(self) -> str:
        return f"<Analysis {self.id} for user {self.user_id}>"
