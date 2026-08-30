"""
DrishtiX LLM Provider Abstraction Interface
Supports OpenAI API, Gemini API, and deterministic Mock Provider fallback.
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, List
import os
from backend.app.core.config import settings

class BaseLLMProvider(ABC):
    @abstractmethod
    def generate_chat_response(
        self,
        question: str,
        system_context: str,
        retrieved_docs: List[Dict[str, Any]],
        language: str = "en"
    ) -> str:
        pass

class MockLLMProvider(BaseLLMProvider):
    """Deterministic fallback provider when API keys are not present."""
    def generate_chat_response(
        self,
        question: str,
        system_context: str,
        retrieved_docs: List[Dict[str, Any]],
        language: str = "en"
    ) -> str:
        q_lower = question.lower()
        
        if "telugu" in q_lower or language == "te":
            return "DrishtiX మీ గ్రామీణ పారిశ్రామిక సిఫార్సులను మీ స్థానిక మార్కెట్ డిమాండ్, నైపుణ్యాలు మరియు లభ్యమయ్యే మూలధనం ఆధారంగా గణించింది."

        if "break-even" in q_lower or "break even" in q_lower:
            return "Break-even is the monthly sales volume where your total revenue exactly equals your total expenses (fixed costs + variable costs + loan EMI). Above this volume, your business makes a net profit."

        if "why" in q_lower and "recommend" in q_lower:
            return "This business was recommended because it has strong local demand in your district, high compatibility with your background skills, and an initial investment that fits your available capital or is easily backed by PMEGP/MUDRA schemes."

        if "sales fall" in q_lower or "-20%" in q_lower or "simulation" in q_lower:
            return "According to our What-If Financial Twin, if sales drop by 20%, your monthly net profit decreases, but your business maintains a positive cash flow as long as sales stay above the break-even threshold."

        if "document" in q_lower or "missing" in q_lower:
            return "To complete your scheme and loan readiness, ensure you have your Aadhaar Card, PAN Card, Bank Statement (last 6 months), Tehsildar Rural Area Certificate, and Detailed Project Report (DPR)."

        doc_summary = ""
        if retrieved_docs:
            doc_summary = f"\n\n[Retrieved Reference: {retrieved_docs[0].get('name')}]"

        return f"Based on DrishtiX decision intelligence for your profile and location, {question} is evaluated using verified rural market indicators and deterministic financial modeling.{doc_summary}"

class OpenAIProvider(BaseLLMProvider):
    def __init__(self, api_key: str):
        self.api_key = api_key

    def generate_chat_response(
        self,
        question: str,
        system_context: str,
        retrieved_docs: List[Dict[str, Any]],
        language: str = "en"
    ) -> str:
        try:
            import httpx
            # Standard OpenAI API request
            headers = {"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json"}
            prompt_content = f"{system_context}\n\nContext Documents:\n{json.dumps(retrieved_docs)}\n\nUser Question: {question}\n\nLanguage: {language}"
            payload = {
                "model": "gpt-3.5-turbo",
                "messages": [
                    {"role": "system", "content": "You are DrishtiX Copilot, a helpful AI decision assistant for rural micro-entrepreneurs in India."},
                    {"role": "user", "content": prompt_content}
                ],
                "temperature": 0.3
            }
            resp = httpx.post("https://api.openai.com/v1/chat/completions", json=payload, headers=headers, timeout=10.0)
            if resp.status_code == 200:
                return resp.json()["choices"][0]["message"]["content"]
        except Exception:
            pass
        return MockLLMProvider().generate_chat_response(question, system_context, retrieved_docs, language)

class GeminiProvider(BaseLLMProvider):
    def __init__(self, api_key: str):
        self.api_key = api_key

    def generate_chat_response(
        self,
        question: str,
        system_context: str,
        retrieved_docs: List[Dict[str, Any]],
        language: str = "en"
    ) -> str:
        try:
            import httpx
            headers = {"Content-Type": "application/json"}
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={self.api_key}"
            prompt_content = f"You are DrishtiX Copilot, a rural entrepreneurship advisor.\n{system_context}\nRetrieved Docs: {retrieved_docs}\n\nQuestion: {question}\nRespond in language: {language}"
            payload = {"contents": [{"parts": [{"text": prompt_content}]}]}
            resp = httpx.post(url, json=payload, headers=headers, timeout=10.0)
            if resp.status_code == 200:
                return resp.json()["candidates"][0]["content"]["parts"][0]["text"]
        except Exception:
            pass
        return MockLLMProvider().generate_chat_response(question, system_context, retrieved_docs, language)

def get_llm_provider() -> BaseLLMProvider:
    provider_type = settings.LLM_PROVIDER.lower()
    if provider_type == "openai" and settings.OPENAI_API_KEY:
        return OpenAIProvider(settings.OPENAI_API_KEY)
    elif provider_type == "gemini" and settings.GEMINI_API_KEY:
        return GeminiProvider(settings.GEMINI_API_KEY)
    return MockLLMProvider()
