from unittest.mock import patch
from models.analysis import Analysis
from models.user import User
from extensions import db


def test_analyze_empty_and_whitespace_validation(logged_in_client):
    """Verify empty and whitespace-only text inputs are rejected."""
    # Empty string
    res1 = logged_in_client.post("/api/analyze", json={"text": ""})
    assert res1.status_code == 400
    assert "cannot be empty" in res1.get_json()["error"].lower()

    # Whitespace only
    res2 = logged_in_client.post("/api/analyze", json={"text": "   \n\t   "})
    assert res2.status_code == 400
    assert "whitespace" in res2.get_json()["error"].lower()


def test_analyze_oversized_text(logged_in_client):
    """Verify text exceeding 20,000 characters is rejected."""
    long_text = "a " * 11000  # 22,000 chars
    res = logged_in_client.post("/api/analyze", json={"text": long_text})
    assert res.status_code == 400
    assert "exceeds the maximum" in res.get_json()["error"].lower()


def test_successful_analysis_and_persistence(logged_in_client, app):
    """Verify full analysis pipeline with database persistence."""
    sample_text = "This is a clean academic test sentence for linguistic verification."

    mock_lt = {
        "success": True,
        "issues": [],
        "attribution": "Powered by LanguageTool (Public API)",
    }
    mock_tone = {
        "success": True,
        "overallTone": "Academic",
        "explanation": "Clear academic prose.",
        "characteristics": ["Clarity"],
        "detectedTones": [
            {"tone": "Academic", "percentage": 85, "description": "Scholarly", "color": "blue"},
            {"tone": "Informative", "percentage": 15, "description": "Direct", "color": "lavender"},
        ],
    }
    mock_improve = {
        "success": True,
        "improvedText": "This is a refined academic sentence for linguistic verification.",
        "changeSummary": "Polished vocabulary.",
        "suggestions": [],
    }

    with patch("services.languagetool_service.LanguageToolService.check_text", return_value=mock_lt):
        with patch("services.groq_service.GroqService.is_configured", return_value=True):
            with patch("services.groq_service.GroqService.analyze_tone", return_value=mock_tone):
                with patch("services.groq_service.GroqService.improve_and_suggest", return_value=mock_improve):
                    res = logged_in_client.post(
                        "/api/analyze",
                        json={"text": sample_text, "tone": "Academic"},
                    )

    assert res.status_code == 200
    data = res.get_json()
    assert data["success"] is True
    analysis = data["analysis"]

    assert analysis["originalText"] == sample_text
    assert analysis["improvedText"] == "This is a refined academic sentence for linguistic verification."
    assert analysis["targetTone"] == "Academic"
    assert "metrics" in analysis
    assert analysis["metrics"]["wordCount"] > 0
    assert analysis["moduleStatus"]["readability"]["status"] == "ok"
    assert analysis["moduleStatus"]["grammar"]["status"] == "ok"
    assert analysis["moduleStatus"]["groq_tone"]["status"] == "ok"

    # Verify database persistence
    with app.app_context():
        record = Analysis.query.filter_by(id=int(analysis["id"])).first()
        assert record is not None
        assert record.target_tone == "Academic"


def test_partial_failure_resilience(logged_in_client):
    """Verify that when Groq is unavailable, the analysis still succeeds and saves."""
    sample_text = "Their are several bottleneck situations occurring in the pipeline."

    mock_lt = {
        "success": True,
        "issues": [
            {
                "id": "iss_1",
                "category": "Grammar",
                "message": "Did you mean 'There are'?",
                "originalText": "Their are",
                "replacements": ["There are"],
                "offset": 0,
                "length": 9,
                "ruleId": "THEIR_THERE",
            }
        ],
        "attribution": "Powered by LanguageTool (Public API)",
    }

    # Simulate Groq being unconfigured
    with patch("services.languagetool_service.LanguageToolService.check_text", return_value=mock_lt):
        with patch("services.groq_service.GroqService.is_configured", return_value=False):
            res = logged_in_client.post(
                "/api/analyze",
                json={"text": sample_text, "tone": "Professional"},
            )

    assert res.status_code == 200
    data = res.get_json()
    assert data["success"] is True
    analysis = data["analysis"]

    # Readability and Grammar succeeded
    assert analysis["metrics"]["wordCount"] == 9
    assert len(analysis["issues"]) == 1
    assert analysis["moduleStatus"]["grammar"]["status"] == "ok"
    # Groq was skipped without crashing the request
    assert analysis["moduleStatus"]["groq_tone"]["status"] == "skipped"
    # Fallback improved text replaced grammar issue
    assert "There are" in analysis["improvedText"]


def test_history_and_user_isolation(client, app, auth_user):
    """
    Verify analysis history isolation:
    User A cannot view, retrieve, or delete records belonging to User B.
    """
    # 1. Log in as User A and create an analysis
    client.post(
        "/api/auth/login",
        json={"email": auth_user["email"], "password": auth_user["password"]},
    )
    mock_lt = {"success": True, "issues": [], "attribution": "Powered by LanguageTool"}
    with patch("services.languagetool_service.LanguageToolService.check_text", return_value=mock_lt):
        with patch("services.groq_service.GroqService.is_configured", return_value=False):
            res = client.post("/api/analyze", json={"text": "User A secret document."})
    assert res.status_code == 200
    user_a_record_id = int(res.get_json()["analysis"]["id"])

    # User A can see this record
    history_res = client.get("/api/history")
    assert history_res.status_code == 200
    assert any(r["id"] == str(user_a_record_id) for r in history_res.get_json()["history"])

    # 2. Register and log in as User B
    client.post(
        "/api/auth/register",
        json={
            "name": "User B",
            "email": "user.b@university.edu",
            "password": "Password123!",
        },
    )

    # 3. User B history must be empty (cannot see User A's record)
    b_history_res = client.get("/api/history")
    assert b_history_res.status_code == 200
    b_history = b_history_res.get_json()["history"]
    assert len(b_history) == 0

    # 4. User B cannot access User A's single record
    b_single_res = client.get(f"/api/history/{user_a_record_id}")
    assert b_single_res.status_code == 404

    # 5. User B cannot delete User A's record
    b_del_res = client.delete(f"/api/history/{user_a_record_id}")
    assert b_del_res.status_code == 404

    # 6. Verify User A's record still exists in database
    with app.app_context():
        rec = db.session.get(Analysis, user_a_record_id)
        assert rec is not None

    # 7. Switch back to User A and verify User A can delete their own record
    client.post(
        "/api/auth/login",
        json={"email": auth_user["email"], "password": auth_user["password"]},
    )
    a_del_res = client.delete(f"/api/history/{user_a_record_id}")
    assert a_del_res.status_code == 200
    assert a_del_res.get_json()["success"] is True

    # After deletion, record is gone
    with app.app_context():
        rec = db.session.get(Analysis, user_a_record_id)
        assert rec is None
