from flask import Flask
from flask_cors import CORS
from config import Config
from extensions import db
from routes import health_bp
from routes.auth_routes import auth_bp
from routes.analysis_routes import analysis_bp
from routes.history_routes import history_bp
from routes.chat_routes import chat_bp


def create_app(config_class=Config):
    """Application factory for Grammar and Style Improver backend."""
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize Database
    db.init_app(app)

    # Configure CORS with credentials support
    allowed_origins = [
        app.config.get("FRONTEND_ORIGIN", "http://localhost:5173"),
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]
    # Remove duplicates while preserving order
    unique_origins = list(dict.fromkeys(allowed_origins))

    CORS(
        app,
        resources={r"/api/*": {"origins": unique_origins}},
        supports_credentials=True,
    )

    # Register Blueprints
    app.register_blueprint(health_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(analysis_bp)
    app.register_blueprint(history_bp)
    app.register_blueprint(chat_bp)

    # Create Database Tables if they do not exist
    with app.app_context():
        db.create_all()

    return app


app = create_app()

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
