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
""",
    "Full Stack Developer": """
Job Overview:
We are seeking an experienced Full Stack Developer proficient in React, Node.js or Python, database architecture, and REST API development.

Responsibilities:
- Build dynamic client-facing web applications using React.js and modern state management.
- Develop robust, scalable backend APIs using Python (FastAPI/Django) or Node.js.
- Manage relational and NoSQL databases (PostgreSQL, MongoDB, Redis).
- Deploy containerized applications with Docker and modern CI/CD pipelines.

Requirements:
- Frontend: React, JavaScript, TypeScript, HTML5, CSS3, Tailwind CSS.
- Backend: Python, FastAPI, Django, Node.js, Express, PostgreSQL, MongoDB.
- DevOps & Tools: Docker, Git, REST APIs, CI/CD, AWS Cloud.
""",
    "Python Developer": """
Job Overview:
Looking for a talented Python Developer to engineer backend services, data pipelines, and scalable APIs.

Responsibilities:
- Architect and maintain REST APIs using FastAPI, Django, or Flask.
- Write clean, modular, test-driven Python code with database integration (PostgreSQL, SQLAlchemy).
- Optimize queries, caching (Redis), and asynchronous processing.

Requirements:
- Languages & Frameworks: Python 3, FastAPI, Django, Flask, SQLAlchemy.
- Databases & Tools: PostgreSQL, MySQL, Redis, Docker, Git, Unit Testing.
""",
    "React Developer": """
Job Overview:
Looking for a React Developer to build high-performance, accessible, and responsive user interfaces.

Responsibilities:
- Build single-page web applications using React, Next.js, and TypeScript.
- Integrate RESTful and GraphQL APIs with robust error handling and state management.
- Ensure cross-browser compatibility, responsive mobile layouts, and web performance.

Requirements:
- Skills: React.js, Next.js, TypeScript, JavaScript, Redux, Tailwind CSS, HTML5, CSS3.
- Tools: Vite, Webpack, Git, Jest, Responsive Web Design.
""",
    "Software Engineer": """
Job Overview:
Seeking a Software Engineer with strong computer science fundamentals, data structures, and problem-solving skills.

Responsibilities:
- Design, develop, test, and deploy enterprise software applications.
- Collaborate across cross-functional engineering teams using Agile/Scrum.
- Participate in code reviews, design discussions, and system architecture planning.

Requirements:
- Languages: Python, Java, JavaScript, TypeScript, or C++.
- Concepts: Object-Oriented Design, System Design, REST APIs, Databases, Git, CI/CD.
""",
    "Data Scientist": """
Job Overview:
Seeking a Data Scientist to extract insights, train machine learning models, and analyze complex datasets.

Responsibilities:
- Build predictive and classification models using Scikit-Learn, PyTorch, or TensorFlow.
- Perform exploratory data analysis, feature engineering, and statistical modeling.
- Communicate data-driven insights through dashboards and visualizations.

Requirements:
- Skills: Python, Pandas, NumPy, Scikit-Learn, SQL, Data Visualization, Statistics.
""",
    "DevOps Engineer": """
Job Overview:
Looking for a DevOps Engineer to automate deployment pipelines, manage cloud infrastructure, and ensure high availability.

Responsibilities:
- Build and maintain CI/CD pipelines using GitHub Actions or Jenkins.
- Manage containerized infrastructure using Docker and Kubernetes on AWS/GCP.
- Monitor system health, performance, security, and logging.

Requirements:
- Skills: Docker, Kubernetes, AWS, Linux, Terraform, CI/CD, Nginx, Shell scripting.
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
