import re
from typing import Tuple, Optional

# Standard RFC 5322 compatible email regex
EMAIL_REGEX = re.compile(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")
MAX_TEXT_LENGTH = 20000  # Reasonable limit for text documents (approx 3,000 - 4,000 words)
MIN_PASSWORD_LENGTH = 6


def validate_registration_data(data: Optional[dict]) -> Tuple[bool, Optional[str]]:
    """Validate user registration payload."""
    if not data or not isinstance(data, dict):
        return False, "Request body must be a valid JSON object."

    name = data.get("name", "").strip() if isinstance(data.get("name"), str) else ""
    email = data.get("email", "").strip() if isinstance(data.get("email"), str) else ""
    password = data.get("password", "") if isinstance(data.get("password"), str) else ""

    if not name:
        return False, "Full name is required."

    if len(name) < 2 or len(name) > 100:
        return False, "Name must be between 2 and 100 characters."

    if not email:
        return False, "Email address is required."

    if not EMAIL_REGEX.match(email):
        return False, "Please provide a valid email address."

    if not password:
        return False, "Password is required."

    if len(password) < MIN_PASSWORD_LENGTH:
        return False, f"Password must be at least {MIN_PASSWORD_LENGTH} characters."

    if len(password) > 128:
        return False, "Password cannot exceed 128 characters."

    return True, None


def validate_login_data(data: Optional[dict]) -> Tuple[bool, Optional[str]]:
    """Validate user login payload."""
    if not data or not isinstance(data, dict):
        return False, "Request body must be a valid JSON object."

    email = data.get("email", "").strip() if isinstance(data.get("email"), str) else ""
    password = data.get("password", "") if isinstance(data.get("password"), str) else ""

    if not email:
        return False, "Email address is required."

    if not password:
        return False, "Password is required."

    return True, None


def validate_analysis_input(data: Optional[dict]) -> Tuple[bool, Optional[str], str, str, str]:
    """
    Validate text input for analysis.
    Returns: (is_valid, error_message, cleaned_text, target_tone, language)
    """
    if not data or not isinstance(data, dict):
        return False, "Request body must be a valid JSON object.", "", "", ""

    raw_text = data.get("text")
    if not isinstance(raw_text, str):
        return False, "Text field is required and must be a string.", "", "", ""

    text = raw_text.strip()
    if not text:
        return False, "Input text cannot be empty or contain only whitespace.", "", "", ""

    if len(text) > MAX_TEXT_LENGTH:
        return (
            False,
            f"Input text exceeds the maximum permitted length of {MAX_TEXT_LENGTH} characters.",
            "",
            "",
            "",
        )

    target_tone = data.get("tone", "Professional")
    valid_tones = ["Professional", "Academic", "Casual", "Persuasive", "Concise"]
    if target_tone not in valid_tones:
        target_tone = "Professional"

    language = data.get("language", "en-US")
    if not isinstance(language, str) or not language:
        language = "en-US"

    return True, None, text, target_tone, language
