import re
from typing import Dict, Optional

FALLBACK_JDS: Dict[str, str] = {
    "Frontend Developer": """
Job Overview:
We are seeking a skilled Frontend Developer proficient in React.js, JavaScript (ES6+), HTML5, CSS3, and Tailwind CSS.

Responsibilities:
- Build responsive, interactive web applications using React and modern CSS frameworks.
- Optimize frontend performance, accessibility, and state management (Redux, Context API).
- Collaborate with UX designers and backend engineers to integrate RESTful APIs.

Requirements:
- Languages/Frameworks: JavaScript, TypeScript, React.js, HTML5, CSS3, Tailwind CSS, Next.js.
- Tools & Skills: Git, Vite, Webpack, Responsive Design, REST API Integration, Jest/Testing.
""",
    "Backend Developer": """
Job Overview:
We are looking for a robust Backend Developer to design, scale, and maintain RESTful & GraphQL APIs and microservices.

Responsibilities:
- Develop secure, high-throughput APIs using Python (FastAPI/Django) or Node.js.
- Design database schemas (PostgreSQL, MongoDB, Redis) and manage ORMs.
- Implement CI/CD pipelines, containerization (Docker), and cloud deployment.

Requirements:
- Languages/Frameworks: Python, FastAPI, Django, Node.js, Express, PostgreSQL, MongoDB, Redis.
- DevOps/Cloud: Docker, Kubernetes, AWS, Git, CI/CD, Microservices architecture.
""",
    "AI Engineer": """
Job Overview:
Looking for an innovative AI Engineer to integrate Large Language Models (LLMs), machine learning models, and Generative AI into enterprise solutions.

Responsibilities:
- Build RAG pipelines, fine-tune LLMs, and craft optimized prompts using LangChain, LlamaIndex, and OpenAI/Gemini APIs.
- Deploy ML models into production using FastAPI and Docker.
- Evaluate model accuracy, latency, and token efficiency.

Requirements:
- AI/ML: Python, PyTorch, TensorFlow, Scikit-Learn, Gemini API, OpenAI, Hugging Face, RAG, Vector DBs (Chroma, Pinecone).
- Software Engineering: FastAPI, Docker, Git, REST APIs, System Design.
"""
}

def extract_contact_info(text: str) -> Dict[str, Optional[str]]:
    """Extract email, phone, name, github, linkedin, portfolio using regex."""
    email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
    phone_pattern = r'\(?\+?\d{1,4}\)?[\s.-]?\(?\d{1,4}\)?[\s.-]?\d{1,4}[\s.-]?\d{1,9}'
    github_pattern = r'(?:https?://)?(?:www\.)?github\.com/[a-zA-Z0-9_-]+'
    linkedin_pattern = r'(?:https?://)?(?:www\.)?linkedin\.com/in/[a-zA-Z0-9_-]+'
    portfolio_pattern = r'(?:https?://)?(?:www\.)?[a-zA-Z0-9_-]+\.(?:io|dev|me|com|app)'

    emails = re.findall(email_pattern, text)
    phones = re.findall(phone_pattern, text)
    githubs = re.findall(github_pattern, text, re.IGNORECASE)
    linkedins = re.findall(linkedin_pattern, text, re.IGNORECASE)
    portfolios = re.findall(portfolio_pattern, text, re.IGNORECASE)

    # Basic Name extraction heuristic: first non-empty line
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    candidate_name = lines[0] if lines and len(lines[0]) < 50 and not '@' in lines[0] else None

    # Filter out valid phones (length check)
    valid_phones = [p for p in phones if len(re.sub(r'\D', '', p)) >= 10]

    return {
        "name": candidate_name,
        "email": emails[0] if emails else None,
        "phone": valid_phones[0] if valid_phones else None,
        "github": githubs[0] if githubs else None,
        "linkedin": linkedins[0] if linkedins else None,
        "portfolio": portfolios[0] if portfolios else None,
    }

def clean_text(text: str) -> str:
    """Normalize text whitespace and remove non-printable characters."""
    text = re.sub(r'\s+', ' ', text)
    return text.strip()
