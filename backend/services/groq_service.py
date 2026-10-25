import json
import logging
import requests
from typing import Dict, Any, List, Optional
from config import Config

logger = logging.getLogger(__name__)


class GroqService:
    """Service to interact with Groq API for tone, rewriting, and writing suggestions."""

    @classmethod
    def is_configured(cls) -> bool:
        """Check if Groq API key is present."""
        return bool(Config.GROQ_API_KEY and Config.GROQ_API_KEY.strip())

    @classmethod
    def _call_groq_chat(
        cls, system_prompt: str, user_prompt: str, temperature: float = 0.2
    ) -> Dict[str, Any]:
        """
        Execute request to official Groq chat completions endpoint with JSON output mode.
        Handles errors safely without leaking credentials or raw stack traces.
        """
        api_key = Config.GROQ_API_KEY.strip() if Config.GROQ_API_KEY else ""
        if not api_key:
            return {
                "success": False,
                "error": "Groq API key is not configured. Tone analysis and AI rewrite are operating in fallback mode.",
                "status_code": 401,
                "code": "MISSING_API_KEY",
            }

        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "User-Agent": "GrammarOptimizer-CollegeProject/1.0",
        }

        payload = {
            "model": Config.GROQ_MODEL,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            "response_format": {"type": "json_object"},
            "temperature": temperature,
            "max_tokens": 2048,
        }

        try:
            response = requests.post(
                Config.GROQ_API_URL,
                headers=headers,
                json=payload,
                timeout=Config.GROQ_TIMEOUT,
            )

            if response.status_code == 401:
                return {
                    "success": False,
                    "error": "Groq authentication failed. Please check your GROQ_API_KEY configuration.",
                    "status_code": 401,
                    "code": "AUTH_FAILED",
                }

            if response.status_code == 429:
                return {
                    "success": False,
                    "error": "Groq API rate limit reached. Please wait a moment before trying again.",
                    "status_code": 429,
                    "code": "RATE_LIMIT",
                }

            if response.status_code != 200:
                return {
                    "success": False,
                    "error": f"Groq provider returned error (HTTP {response.status_code}).",
                    "status_code": response.status_code,
                    "code": "PROVIDER_ERROR",
                }

            res_json = response.json()
            choices = res_json.get("choices", [])
            if not choices:
                return {
                    "success": False,
                    "error": "Groq returned an empty response.",
                    "status_code": 502,
                    "code": "EMPTY_RESPONSE",
                }

            content = choices[0].get("message", {}).get("content", "{}")
            parsed_data = json.loads(content)
            return {"success": True, "data": parsed_data}

        except requests.exceptions.Timeout:
            return {
                "success": False,
                "error": "Groq API request timed out.",
                "status_code": 504,
                "code": "TIMEOUT",
            }
        except requests.exceptions.RequestException:
            return {
                "success": False,
                "error": "Network error while connecting to Groq API.",
                "status_code": 503,
                "code": "NETWORK_ERROR",
            }
        except json.JSONDecodeError:
            return {
                "success": False,
                "error": "Failed to parse structured JSON from Groq response.",
                "status_code": 502,
                "code": "INVALID_JSON",
            }
        except Exception as e:
            logger.error("Unexpected error in Groq service: %s", str(e))
            return {
                "success": False,
                "error": "An unexpected error occurred during AI analysis.",
                "status_code": 500,
                "code": "INTERNAL_ERROR",
            }

    @classmethod
    def analyze_tone(cls, text: str, target_tone: str = "Professional") -> Dict[str, Any]:
        """
        Analyze tone of text using Groq.
        Returns overall tone, explanation, text characteristics, and tone distribution.
        """
        system_prompt = (
            "You are an expert linguistic tone and style analyst. Analyze the emotional, "
            "stylistic, and semantic tone of the provided text. Return your assessment strictly "
            "as a valid JSON object matching this schema:\n"
            "{\n"
            '  "overallTone": "Professional" | "Academic" | "Casual" | "Persuasive" | "Concise" | "Mixed" | "Neutral",\n'
            '  "explanation": "Short, objective explanation of the tone",\n'
            '  "characteristics": ["list", "of", "notable", "linguistic", "traits"],\n'
            '  "tones": [\n'
            '    {"tone": "ToneName", "percentage": 70, "description": "Short description", "color": "blue"|"lavender"|"pink"|"mint"},\n'
            '    {"tone": "ToneName2", "percentage": 30, "description": "Short description", "color": "blue"|"lavender"|"pink"|"mint"}\n'
            "  ]\n"
            "}\n"
            "If the tone is ambiguous or multi-faceted, classify overallTone as 'Mixed' or 'Neutral'. "
            "Ensure percentages in 'tones' sum to 100. Colors must be chosen from: blue, lavender, pink, mint."
        )

        user_prompt = f"Target tone desired by user: {target_tone}\n\nText to analyze:\n{text}"

        res = cls._call_groq_chat(system_prompt, user_prompt, temperature=0.2)
        if not res["success"]:
            return res

        data = res.get("data", {})
        # Validate schema
        overall_tone = data.get("overallTone", target_tone)
        explanation = data.get("explanation", "Tone analysis completed.")
        tones = data.get("tones", [])

        # Ensure valid tone structure for frontend
        valid_tones = []
        color_cycle = ["blue", "lavender", "mint", "pink"]
        for idx, t in enumerate(tones):
            if isinstance(t, dict) and "tone" in t and "percentage" in t:
                color = t.get("color")
                if color not in ["blue", "lavender", "pink", "mint"]:
                    color = color_cycle[idx % len(color_cycle)]
                valid_tones.append(
                    {
                        "tone": str(t["tone"]),
                        "percentage": int(t["percentage"]),
                        "description": str(t.get("description", "")),
                        "color": color,
                    }
                )

        if not valid_tones:
            valid_tones = [
                {
                    "tone": overall_tone,
                    "percentage": 100,
                    "description": explanation,
                    "color": "blue",
                }
            ]

        return {
            "success": True,
            "overallTone": overall_tone,
            "explanation": explanation,
            "characteristics": data.get("characteristics", []),
            "detectedTones": valid_tones,
        }

    @classmethod
    def improve_and_suggest(
        cls, text: str, target_tone: str = "Professional"
    ) -> Dict[str, Any]:
        """
        Rewrite text to optimize style, vocabulary, and conciseness, and produce categorized suggestions.
        Returns improvedText, changeSummary, and list of WritingSuggestions.
        """
        system_prompt = (
            "You are a master academic and professional writing editor. Your task is to rewrite "
            "and improve the given text according to the target tone, fixing awkward phrasing, "
            "wordiness, passive voice overuse, and unclear expressions while strictly preserving "
            "the core meaning and factual content.\n"
            "Also provide 2 to 5 actionable writing suggestions highlighting specific before/after segments.\n"
            "Return strictly a valid JSON object matching this schema:\n"
            "{\n"
            '  "improvedText": "Complete rewritten and polished text",\n'
            '  "changeSummary": "Concise summary of key stylistic adjustments made",\n'
            '  "suggestions": [\n'
            "    {\n"
            '      "category": "Clarity" | "Conciseness" | "Active Voice" | "Vocabulary",\n'
            '      "title": "Short title describing the issue",\n'
            '      "explanation": "Clear explanation of why the change improves the text",\n'
            '      "before": "Original phrasing snippet from text",\n'
            '      "after": "Recommended revision",\n'
            '      "severity": "high" | "medium" | "low"\n'
            "    }\n"
            "  ]\n"
            "}"
        )

        user_prompt = f"Target tone: {target_tone}\n\nOriginal Text:\n{text}"

        res = cls._call_groq_chat(system_prompt, user_prompt, temperature=0.3)
        if not res["success"]:
            return res

        data = res.get("data", {})
        improved_text = data.get("improvedText", text)
        change_summary = data.get("changeSummary", "Optimized phrasing and tone.")
        raw_suggestions = data.get("suggestions", [])

        suggestions: List[Dict[str, Any]] = []
        valid_cats = {"Clarity", "Conciseness", "Active Voice", "Vocabulary"}
        valid_sevs = {"high", "medium", "low"}

        for idx, s in enumerate(raw_suggestions):
            if isinstance(s, dict) and "before" in s and "after" in s:
                cat = s.get("category", "Clarity")
                if cat not in valid_cats:
                    cat = "Clarity"
                sev = s.get("severity", "medium").lower()
                if sev not in valid_sevs:
                    sev = "medium"

                suggestions.append(
                    {
                        "id": f"sug_{idx + 1}",
                        "category": cat,
                        "title": s.get("title", f"{cat} Enhancement"),
                        "explanation": s.get(
                            "explanation", "Improves readability and flow."
                        ),
                        "before": str(s.get("before", "")),
                        "after": str(s.get("after", "")),
                        "severity": sev,
                    }
                )

        return {
            "success": True,
            "improvedText": improved_text,
            "changeSummary": change_summary,
            "suggestions": suggestions,
        }

    @classmethod
    def chat_conversation(
        cls, messages: List[Dict[str, str]], temperature: float = 0.5, max_tokens: int = 1024
    ) -> Dict[str, Any]:
        """
        Interactive conversational assistant for Grammar & Style Improver.
        Provides helpful, real-time advice on grammar rules, style improvements,
        readability scoring, tone calibration, and stylistic sentence rewrites.
        """
        api_key = Config.GROQ_API_KEY.strip() if Config.GROQ_API_KEY else ""
        if not api_key:
            return {
                "success": False,
                "error": "Groq API key is not configured on the server. Please check your backend configuration.",
                "status_code": 503,
                "code": "MISSING_API_KEY",
            }

        # Validate incoming message list
        if not isinstance(messages, list) or len(messages) == 0:
            return {
                "success": False,
                "error": "Messages must be a non-empty list of message objects.",
                "status_code": 400,
                "code": "INVALID_MESSAGES",
            }

        cleaned_messages = []
        for msg in messages[-10:]:  # Keep recent context (last 10 messages)
            if not isinstance(msg, dict):
                continue
            role = msg.get("role")
            content = msg.get("content")
            if role not in ("user", "assistant") or not isinstance(content, str):
                continue
            content_str = content.strip()
            if not content_str:
                continue
            # Enforce max length per message (2000 chars)
            if len(content_str) > 2000:
                content_str = content_str[:2000]
            cleaned_messages.append({"role": role, "content": content_str})

        if not cleaned_messages or not any(m["role"] == "user" for m in cleaned_messages):
            return {
                "success": False,
                "error": "At least one valid user message is required.",
                "status_code": 400,
                "code": "EMPTY_USER_MESSAGE",
            }

        system_instruction = (
            "You are the AI Writing Assistant for the Grammar & Style Improver platform.\n"
            "You are an expert on English grammar, syntax rules, spelling, punctuation, "
            "sentence clarity, readability formulas (specifically the Flesch Reading Ease index), "
            "tone optimization (professional, academic, casual, concise), active vs. passive voice, "
            "and stylistic sentence rewrites.\n"
            "Guidelines:\n"
            "- Answer questions about grammar, punctuation, and readability clearly and accurately.\n"
            "- When explaining rules, provide concise, concrete examples.\n"
            "- When asked to improve, rewrite, or polish text, provide the rewritten version and a concise explanation of what was changed and why.\n"
            "- Explain readability scores and syllable math clearly when asked.\n"
            "- Use clean Markdown formatting with bullet points and bolding where appropriate.\n"
            "- Be professional, supportive, and direct."
        )

        full_messages = [{"role": "system", "content": system_instruction}] + cleaned_messages

        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "User-Agent": "GrammarOptimizer-Chatbot/1.0",
        }

        payload = {
            "model": Config.GROQ_MODEL,
            "messages": full_messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
        }

        try:
            response = requests.post(
                Config.GROQ_API_URL,
                headers=headers,
                json=payload,
                timeout=Config.GROQ_TIMEOUT,
            )

            if response.status_code == 401:
                return {
                    "success": False,
                    "error": "Groq authentication failed. Please verify the GROQ_API_KEY.",
                    "status_code": 401,
                    "code": "AUTH_FAILED",
                }

            if response.status_code == 429:
                return {
                    "success": False,
                    "error": "Groq rate limit reached. Please wait a moment before sending another message.",
                    "status_code": 429,
                    "code": "RATE_LIMIT",
                }

            if response.status_code != 200:
                logger.error("Groq chat API error: HTTP %s - %s", response.status_code, response.text)
                return {
                    "success": False,
                    "error": f"Groq provider returned an error (HTTP {response.status_code}).",
                    "status_code": response.status_code,
                    "code": "PROVIDER_ERROR",
                }

            res_json = response.json()
            choices = res_json.get("choices", [])
            if not choices:
                return {
                    "success": False,
                    "error": "Groq returned an empty response.",
                    "status_code": 502,
                    "code": "EMPTY_RESPONSE",
                }

            reply_text = choices[0].get("message", {}).get("content", "").strip()
            return {
                "success": True,
                "reply": reply_text,
                "model": Config.GROQ_MODEL,
            }

        except requests.exceptions.Timeout:
            return {
                "success": False,
                "error": "Groq API request timed out. Please try your question again.",
                "status_code": 504,
                "code": "TIMEOUT",
            }
        except requests.exceptions.RequestException:
            return {
                "success": False,
                "error": "Network error while connecting to Groq AI service.",
                "status_code": 503,
                "code": "NETWORK_ERROR",
            }
        except Exception as e:
            logger.error("Unexpected error in Groq chat service: %s", str(e))
            return {
                "success": False,
                "error": "An unexpected error occurred while generating the assistant reply.",
                "status_code": 500,
                "code": "INTERNAL_ERROR",
            }
