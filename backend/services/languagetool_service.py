import requests
from typing import Dict, Any, List, Optional
from config import Config


class LanguageToolService:
    """Service to interact with LanguageTool Public Proofreading HTTP API."""

    CATEGORY_MAP = {
        "TYPOS": "Spelling",
        "SPELLING": "Spelling",
        "GRAMMAR": "Grammar",
        "PUNCTUATION": "Punctuation",
        "STYLE": "Style & Clarity",
        "REDUNDANCY": "Style & Clarity",
        "PLAIN_ENGLISH": "Style & Clarity",
        "COLLOQUIALISMS": "Style & Clarity",
        "SEMANTICS": "Style & Clarity",
        "MISC": "Grammar",
    }

    @classmethod
    def check_text(
        cls, text: str, language: str = "en-US", timeout: Optional[int] = None
    ) -> Dict[str, Any]:
        """
        Send text to LanguageTool check endpoint and parse grammar & spelling issues.
        Returns a dict with success boolean, issues list, and status/error details.
        """
        cleaned_text = text.strip() if text else ""
        if not cleaned_text:
            return {
                "success": True,
                "issues": [],
                "error": None,
                "attribution": "Powered by LanguageTool (Public API)",
            }

        url = Config.LANGUAGETOOL_API_URL
        req_timeout = timeout or Config.LANGUAGETOOL_TIMEOUT
        payload = {
            "text": cleaned_text,
            "language": language or "en-US",
        }
        headers = {
            "User-Agent": "GrammarOptimizer-CollegeProject/1.0",
            "Accept": "application/json",
        }

        try:
            response = requests.post(
                url, data=payload, headers=headers, timeout=req_timeout
            )

            if response.status_code == 429:
                return {
                    "success": False,
                    "issues": [],
                    "error": "LanguageTool public API rate limit reached. Please wait a moment before resubmitting.",
                    "status_code": 429,
                    "attribution": "Powered by LanguageTool (Public API)",
                }

            if response.status_code != 200:
                return {
                    "success": False,
                    "issues": [],
                    "error": f"LanguageTool returned HTTP error: {response.status_code}",
                    "status_code": response.status_code,
                    "attribution": "Powered by LanguageTool (Public API)",
                }

            data = response.json()
            matches = data.get("matches", [])
            issues: List[Dict[str, Any]] = []

            for idx, match in enumerate(matches):
                offset = match.get("offset", 0)
                length = match.get("length", 0)

                # Extract exact snippet from original text if bounds are valid
                if 0 <= offset <= len(cleaned_text) and offset + length <= len(
                    cleaned_text
                ):
                    original_snippet = cleaned_text[offset : offset + length]
                else:
                    context = match.get("context", {})
                    original_snippet = context.get("text", "")

                # Map rule category to standardized frontend category
                rule = match.get("rule", {})
                rule_category_id = rule.get("category", {}).get("id", "").upper()
                category = cls.CATEGORY_MAP.get(rule_category_id, "Grammar")

                # Extract replacement options
                replacements = [
                    rep.get("value")
                    for rep in match.get("replacements", [])
                    if rep.get("value")
                ][:5]

                issue_id = f"iss_{idx + 1}"
                issues.append(
                    {
                        "id": issue_id,
                        "category": category,
                        "message": match.get("message", "Possible writing issue."),
                        "originalText": original_snippet,
                        "replacements": replacements,
                        "offset": offset,
                        "length": length,
                        "ruleId": rule.get("id", "LT_RULE"),
                    }
                )

            return {
                "success": True,
                "issues": issues,
                "error": None,
                "attribution": "Powered by LanguageTool (Public API)",
            }

        except requests.exceptions.Timeout:
            return {
                "success": False,
                "issues": [],
                "error": "LanguageTool request timed out. Public endpoint may be experiencing high load.",
                "status_code": 504,
                "attribution": "Powered by LanguageTool (Public API)",
            }
        except requests.exceptions.RequestException as e:
            return {
                "success": False,
                "issues": [],
                "error": "Unable to connect to LanguageTool public API. Check your internet connection.",
                "status_code": 503,
                "attribution": "Powered by LanguageTool (Public API)",
            }
        except Exception as e:
            return {
                "success": False,
                "issues": [],
                "error": f"Error parsing LanguageTool response: {str(e)}",
                "status_code": 500,
                "attribution": "Powered by LanguageTool (Public API)",
            }
