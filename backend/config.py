import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file in backend/
env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path, override=True)


class Config:
    """Base application configuration."""

    SECRET_KEY = os.getenv("FLASK_SECRET_KEY", "dev-secret-key-grammar-optimizer-2026")
    
    # Database Configuration
    # Defaults to SQLite inside backend/instance/ or backend/
    base_dir = Path(__file__).resolve().parent
    db_env = os.getenv("DATABASE_URL")
    if db_env:
        SQLALCHEMY_DATABASE_URI = db_env
    else:
        db_path = base_dir / "instance" / "grammar_improver.db"
        db_path.parent.mkdir(parents=True, exist_ok=True)
        SQLALCHEMY_DATABASE_URI = f"sqlite:///{db_path.as_posix()}"

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Session and Cookie Configuration
    SESSION_COOKIE_NAME = "grammar_optimizer_session"
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = os.getenv("SESSION_COOKIE_SAMESITE", "Lax")
    SESSION_COOKIE_SECURE = os.getenv("FLASK_ENV") == "production"

    # CORS Configuration
    FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")

    # LanguageTool API Configuration
    LANGUAGETOOL_API_URL = os.getenv(
        "LANGUAGETOOL_API_URL", "https://api.languagetool.org/v2/check"
    )
    LANGUAGETOOL_TIMEOUT = int(os.getenv("LANGUAGETOOL_TIMEOUT", "10"))

    # Groq API Configuration
    GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
    GROQ_MODEL = os.getenv("GROQ_MODEL", "qwen/qwen3.8-27b")
    GROQ_API_URL = os.getenv(
        "GROQ_API_URL", "https://api.groq.com/openai/v1/chat/completions"
    )
    GROQ_TIMEOUT = int(os.getenv("GROQ_TIMEOUT", "15"))


class TestConfig(Config):
    """Configuration for testing."""

    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    WTF_CSRF_ENABLED = False
    SESSION_COOKIE_SECURE = False
