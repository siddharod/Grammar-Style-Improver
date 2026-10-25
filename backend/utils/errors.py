from flask import jsonify
from typing import Any, Tuple, Optional


class APIError(Exception):
    """Custom exception for API errors."""

    def __init__(self, message: str, status_code: int = 400, details: Optional[Any] = None):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.details = details

    def to_dict(self) -> dict:
        result = {"success": False, "error": self.message}
        if self.details is not None:
            result["details"] = self.details
        return result


def error_response(message: str, status_code: int = 400, details: Optional[Any] = None) -> Tuple[Any, int]:
    """Return a consistent error JSON response."""
    payload = {"success": False, "error": message}
    if details is not None:
        payload["details"] = details
    return jsonify(payload), status_code


def success_response(data: Any = None, message: Optional[str] = None, status_code: int = 200) -> Tuple[Any, int]:
    """Return a consistent success JSON response."""
    payload = {"success": True}
    if message:
        payload["message"] = message
    if data is not None:
        if isinstance(data, dict) and "data" not in data:
            payload.update(data)
        else:
            payload["data"] = data
    return jsonify(payload), status_code
