from unittest.mock import patch, MagicMock
import json
import requests
from services.groq_service import GroqService
from config import Config


def test_missing_api_key():
    """Verify service behavior when GROQ_API_KEY is unset or empty."""
    with patch.object(Config, "GROQ_API_KEY", ""):
        assert GroqService.is_configured() is False
        res = GroqService.analyze_tone("Some text")
        assert res["success"] is False
        assert "not configured" in res["error"].lower()


def test_tone_analysis_parsing():
    """Verify structured tone analysis JSON is parsed correctly."""
    mock_payload = {
        "overallTone": "Academic",
        "explanation": "Scholarly, formal vocabulary with objective syntax.",
        "characteristics": ["Formal diction", "Passive constructions"],
        "tones": [
            {"tone": "Academic", "percentage": 70, "description": "Primary style", "color": "blue"},
            {"tone": "Analytical", "percentage": 30, "description": "Supporting structure", "color": "lavender"},
        ],
    }

    mock_resp = MagicMock()
    mock_resp.status_code = 200
    mock_resp.json.return_value = {
        "choices": [{"message": {"content": json.dumps(mock_payload)}}]
    }

    with patch.object(Config, "GROQ_API_KEY", "gsk_test_key_123"):
        with patch("requests.post", return_value=mock_resp):
            res = GroqService.analyze_tone("The hypothesis was confirmed.")

    assert res["success"] is True
    assert res["overallTone"] == "Academic"
    assert len(res["detectedTones"]) == 2
    assert res["detectedTones"][0]["percentage"] == 70
    assert res["detectedTones"][0]["color"] == "blue"


def test_improvement_and_suggestions_parsing():
    """Verify improved text and writing suggestions parsing."""
    mock_payload = {
        "improvedText": "We must coordinate our team resources.",
        "changeSummary": "Eliminated corporate jargon and simplified syntax.",
        "suggestions": [
            {
                "category": "Clarity",
                "title": "Replace Buzzword",
                "explanation": "'Synergize bandwidth' is vague jargon.",
                "before": "synergize cross-functional bandwidth",
                "after": "coordinate team resources",
                "severity": "medium",
            }
        ],
    }

    mock_resp = MagicMock()
    mock_resp.status_code = 200
    mock_resp.json.return_value = {
        "choices": [{"message": {"content": json.dumps(mock_payload)}}]
    }

    with patch.object(Config, "GROQ_API_KEY", "gsk_test_key_123"):
        with patch("requests.post", return_value=mock_resp):
            res = GroqService.improve_and_suggest(
                "We need to synergize cross-functional bandwidth.", target_tone="Professional"
            )

    assert res["success"] is True
    assert res["improvedText"] == "We must coordinate our team resources."
    assert len(res["suggestions"]) == 1
    assert res["suggestions"][0]["category"] == "Clarity"
    assert res["suggestions"][0]["before"] == "synergize cross-functional bandwidth"


def test_groq_rate_limit():
    """Verify Groq 429 rate limit error handling."""
    mock_resp = MagicMock()
    mock_resp.status_code = 429

    with patch.object(Config, "GROQ_API_KEY", "gsk_test_key_123"):
        with patch("requests.post", return_value=mock_resp):
            res = GroqService.analyze_tone("Sample text")

    assert res["success"] is False
    assert res["status_code"] == 429
    assert "rate limit reached" in res["error"].lower()


def test_groq_timeout():
    """Verify Groq timeout handling."""
    with patch.object(Config, "GROQ_API_KEY", "gsk_test_key_123"):
        with patch("requests.post", side_effect=requests.exceptions.Timeout("Timeout")):
            res = GroqService.analyze_tone("Sample text")

    assert res["success"] is False
    assert res["status_code"] == 504
    assert "timed out" in res["error"].lower()
