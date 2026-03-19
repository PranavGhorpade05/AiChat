import google.generativeai as genai
from app.config import GOOGLE_GEMINI_API_KEY
from typing import List, Dict
import time

genai.configure(api_key=GOOGLE_GEMINI_API_KEY)


class GeminiService:
    def __init__(self):
        self.model = genai.GenerativeModel("gemini-2.5-flash")
        self.max_retries = 3
        self.retry_delay = 1  

    def generate_response(self, prompt: str, history: List[Dict] = None) -> str:
        """
        Generate a response from Gemini API with chat history context
        Includes automatic retry logic for rate limiting
        """
        for attempt in range(self.max_retries):
            try:
                # Prepare history
                messages = [
                    {
                        "role": "user" if msg.get("role") == "user" else "model",
                        "parts": [{"text": msg.get("content", "")}]
                    }
                    for msg in (history or [])
                ]

                chat = self.model.start_chat(history=messages)
                
                # Send the new message and get response
                response = chat.send_message(prompt)

                return response.text

            except Exception as e:
                error_str = str(e).lower()

                is_rate_limit = any(keyword in error_str for keyword in [
                    "rate", "quota", "429", "too many requests", "resource exhausted"
                ])

                # Retry if rate limited
                if is_rate_limit and attempt < self.max_retries - 1:
                    time.sleep(self.retry_delay * (2 ** attempt))
                    continue

                # Final error response
                if is_rate_limit:
                    return "⏳ Too many requests. Please try again later."

                return f"Error: {str(e)}"

        return "Error: Failed after retries"


gemini_service = GeminiService()
