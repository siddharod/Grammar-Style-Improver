from unittest.mock import patch, MagicMock
import requests
from services.languagetool_service import LanguageToolService


def test_empty_input():
    """Verify empty input returns cleanly without making external calls."""
    res = LanguageToolService.check_text("")
    assert res["success"] is True
    assert res["issues"] == []
    assert "LanguageTool" in res["attribution"]


def test_successful_parsing():
    """Verify LanguageTool API response is parsed into GrammarIssue schema."""
    mock_lt_response = {
        "matches": [
            {
                "message": "Possible spelling mistake found.",
                "offset": 5,
                "length": 8,
                "context": {"text": "They beleive in science.", "offset": 5, "length": 8},
                "rule": {
                    "id": "MORFOLOGIK_RULE_EN_US",
                    "category": {"id": "TYPOS", "name": "Possible Typo"},
                },
                "replacements": [{"value": "believe"}, {"value": "believes"}],
            },
            {
                "message": "Did you mean 'There are'?",
                "offset": 0,
                "length": 9,
                "context": {"text": "Their are cars.", "offset": 0, "length": 9},
                "rule": {
                    "id": "THEIR_THERE",
                    "category": {"id": "GRAMMAR", "name": "Grammar"},
                },
                "replacements": [{"value": "There are"}],
            },
        ]
    }

    mock_resp = MagicMock()
    mock_resp.status_code = 200
    mock_resp.json.return_value = mock_lt_response

    with patch("requests.post", return_value=mock_resp):
        res = LanguageToolService.check_text("Their are people who beleive it.")

    assert res["success"] is True
    assert len(res["issues"]) == 2

    # Issue 1 - Typo mapped to Spelling
    iss1 = res["issues"][0]
    assert iss1["category"] == "Spelling"
    assert iss1["replacements"] == ["believe", "believes"]
    assert iss1["ruleId"] == "MORFOLOGIK_RULE_EN_US"

    # Issue 2 - Grammar mapped to Grammar
    iss2 = res["issues"][1]
    assert iss2["category"] == "Grammar"
    assert iss2["replacements"] == ["There are"]
    assert iss2["ruleId"] == "THEIR_THERE"


def test_rate_limit_429():
    """Verify 429 rate limit is handled gracefully with informative error."""
    mock_resp = MagicMock()
    mock_resp.status_code = 429

    with patch("requests.post", return_value=mock_resp):
        res = LanguageToolService.check_text("Some sample text.")

    assert res["success"] is False
    assert res["status_code"] == 429
    assert "rate limit reached" in res["error"].lower()


def test_timeout_handling():
    """Verify timeout is caught and returns 504 status with clean message."""
    with patch("requests.post", side_effect=requests.exceptions.Timeout("Request timed out")):
        res = LanguageToolService.check_text("Some text.")

    assert res["success"] is False
    assert res["status_code"] == 504
    assert "timed out" in res["error"].lower()
