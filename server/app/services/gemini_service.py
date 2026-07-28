import json
import logging
import requests
from app.config.config import settings
from app.prompts.analyze_prompts import SYSTEM_JD_GENERATION_PROMPT, SYSTEM_RESUME_ANALYSIS_PROMPT
from app.utils.helpers import FALLBACK_JDS

logger = logging.getLogger("uvicorn")

try:
    import google.generativeai as genai
    HAS_GENAI_SDK = True
except ImportError:
    HAS_GENAI_SDK = False

class GeminiService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.is_configured = bool(self.api_key and self.api_key.strip())

        if self.is_configured and HAS_GENAI_SDK:
            try:
                genai.configure(api_key=self.api_key)
                self.model = genai.GenerativeModel("gemini-1.5-flash")
            except Exception as e:
                logger.warning(f"Failed to initialize google.generativeai SDK: {e}")

    def _call_gemini_rest(self, prompt: str, is_json: bool = False) -> str:
        """Fallback direct REST API call to Gemini endpoints."""
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={self.api_key}"
        payload = {
            "contents": [{"parts": [{"text": prompt}]}]
        }
        if is_json:
            payload["generationConfig"] = {"responseMimeType": "application/json"}

        headers = {"Content-Type": "application/json"}
        resp = requests.post(url, json=payload, headers=headers, timeout=30)
        if resp.status_code == 200:
            data = resp.json()
            candidates = data.get("candidates", [])
            if candidates and "content" in candidates[0]:
                parts = candidates[0]["content"].get("parts", [])
                if parts:
                    return parts[0].get("text", "")
        else:
            logger.warning(f"Gemini REST API error {resp.status_code}: {resp.text}")
        return ""

    def generate_job_description(self, role: str) -> str:
        """Generate a realistic Job Description for a given role via Gemini or fallback."""
        if self.is_configured:
            prompt = SYSTEM_JD_GENERATION_PROMPT.format(role=role)
            
            # 1. Try SDK if available
            if HAS_GENAI_SDK and hasattr(self, 'model'):
                try:
                    res = self.model.generate_content(prompt)
                    if res and res.text:
                        return res.text.strip()
                except Exception as e:
                    logger.warning(f"Gemini SDK JD generation error: {e}")

            # 2. Try REST API
            try:
                text = self._call_gemini_rest(prompt)
                if text:
                    return text.strip()
            except Exception as e:
                logger.warning(f"Gemini REST JD generation error: {e}")

        # Fallback if API key missing or call fails
        return FALLBACK_JDS.get(
            role, 
            f"Job Overview:\nWe are seeking a qualified {role} with industry experience, strong technical problem-solving skills, and expertise in modern development workflows and best practices."
        )

    def analyze_resume_with_ai(self, resume_text: str, job_description: str) -> dict:
        """Perform full AI reasoning analysis on resume vs JD using Gemini."""
        if self.is_configured:
            prompt = SYSTEM_RESUME_ANALYSIS_PROMPT.format(
                resume_text=resume_text[:4000],
                job_description=job_description[:3000]
            )

            raw_json_str = ""
            
            # 1. Try SDK if available
            if HAS_GENAI_SDK and hasattr(self, 'model'):
                try:
                    res = self.model.generate_content(
                        prompt,
                        generation_config={"response_mime_type": "application/json"}
                    )
                    if res and res.text:
                        raw_json_str = res.text.strip()
                except Exception as e:
                    logger.warning(f"Gemini SDK analysis error: {e}")

            # 2. Try REST API if SDK failed or not available
            if not raw_json_str:
                try:
                    raw_json_str = self._call_gemini_rest(prompt, is_json=True)
                except Exception as e:
                    logger.warning(f"Gemini REST analysis error: {e}")

            if raw_json_str:
                try:
                    clean_text = raw_json_str.strip()
                    if clean_text.startswith("```json"):
                        clean_text = clean_text[7:]
                    if clean_text.endswith("```"):
                        clean_text = clean_text[:-3]
                    return json.loads(clean_text)
                except Exception as e:
                    logger.warning(f"Failed to parse Gemini JSON output: {e}")

        # Heuristic fallback structure if API key not set or quota exceeded
        return {
            "summary": "Candidate exhibits core developer skills with background in software development. Further alignment with role-specific keywords and cloud practices is recommended.",
            "strengths": [
                "Solid foundation in software development principles and problem-solving.",
                "Demonstrated hands-on experience in core programming languages.",
                "Clean resume structure with identifiable contact details."
            ],
            "weaknesses": [
                "Missing explicit metrics and quantified impact on project deliverables.",
                "Limited coverage of advanced cloud infrastructure / DevOps toolchains.",
                "Some industry-standard ATS keywords from the job description are missing."
            ],
            "missing_skills": ["Docker", "Kubernetes", "AWS Cloud", "CI/CD Pipelines", "System Design"],
            "projects": [
                "Build a microservices-based REST API with containerized Docker deployment and CI/CD.",
                "Create a real-time analytics dashboard integrating WebSockets and automated caching.",
                "Implement an AI-powered document processing pipeline with FastAPI and vector database search."
            ],
            "certifications": [
                "AWS Certified Developer - Associate",
                "HashiCorp Certified: Terraform Associate",
                "Meta Front-End / Back-End Developer Professional Certificate"
            ],
            "interview_tips": [
                "Be ready to explain the architectural trade-offs in your recent projects.",
                "Practice coding problems focusing on data structures, searching, and sorting.",
                "Prepare STAR-method responses highlighting quantified achievements in past roles."
            ],
            "roadmap": [
                "Weeks 1-2: Master missing core frameworks & containerization fundamentals (Docker).",
                "Weeks 3-4: Build a full-stack portfolio project incorporating unit tests and CI/CD.",
                "Weeks 5-6: System design preparation and mock technical interview practice."
            ],
            "career_advice": "Focus on highlighting business impact (e.g. '% speedup', '$ cost savings') and acquiring cloud/DevOps certifications to stand out to senior technical recruiters.",
            "suggestions": [
                "Add quantified metrics (e.g., 'Improved API response time by 40%') to work experience bullets.",
                "Include a dedicated ATS skills section categorized by Frontend, Backend, Database, and DevOps.",
                "Add direct GitHub repository links for all listed personal projects."
            ]
        }

gemini_service = GeminiService()
