from unittest.mock import patch
from services.groq_service import GroqService


def test_chat_status(client):
    """Test the GET /api/chat/status endpoint."""
    response = client.get("/api/chat/status")
    assert response.status_code == 200
    data = response.get_json()
    assert data["success"] is True
    assert "available" in data
    assert data["provider"] == "Groq Cloud API"


def test_chat_invalid_payload(client):
    """Test chat endpoint with invalid non-JSON body."""
    response = client.post("/api/chat", data="not json", content_type="text/plain")
    assert response.status_code == 400
    data = response.get_json()
    assert data["success"] is False


def test_chat_missing_messages(client):
    """Test chat endpoint with empty message list."""
    response = client.post("/api/chat", json={"messages": []})
    assert response.status_code == 400
    data = response.get_json()
    assert data["success"] is False


def test_chat_empty_user_message(client):
    """Test chat endpoint with whitespace-only content."""
    response = client.post(
        "/api/chat",
        json={"messages": [{"role": "user", "content": "   "}]},
    )
    assert response.status_code == 400
    data = response.get_json()
    assert data["success"] is False


def test_chat_success_mock(client):
    """Test successful chat interaction with mocked Groq response."""
    mock_reply = "Active voice makes your writing clearer and more direct."
    with patch.object(
        GroqService,
        "chat_conversation",
        return_value={"success": True, "reply": mock_reply, "model": "qwen/qwen3.8-27b"},
    ):
        response = client.post(
            "/api/chat",
            json={
                "messages": [
                    {
                        "role": "user",
                        "content": "Why should I use active voice?",
                    }
                ]
            },
        )
        assert response.status_code == 200
        data = response.get_json()
        assert data["success"] is True
        assert data["reply"] == mock_reply
