from datetime import datetime, timezone
from werkzeug.security import generate_password_hash, check_password_hash
from extensions import db


class User(db.Model):
    """User model with secure password hashing and metadata."""

    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(100), default="Student / Researcher")
    created_at = db.Column(
        db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )

    # Relationships
    analyses = db.relationship(
        "Analysis", backref="user", lazy="dynamic", cascade="all, delete-orphan"
    )

    def set_password(self, password: str) -> None:
        """Hash and set the user's password."""
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        """Verify password against stored hash."""
        return check_password_hash(self.password_hash, password)

    def to_dict(self) -> dict:
        """Return safe user profile dictionary (never exposes password hash)."""
        return {
            "id": str(self.id),
            "name": self.name,
            "email": self.email,
            "role": self.role or "Student / Researcher",
            "joinedDate": self.created_at.strftime("%b %Y"),
            "analysesCount": self.analyses.count(),
        }

    def __repr__(self) -> str:
        return f"<User {self.email}>"
