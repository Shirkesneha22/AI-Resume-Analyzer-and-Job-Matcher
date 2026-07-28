import os
from pathlib import Path

def _load_env_file(env_path: Path):
    """Manually parse .env file if python-dotenv is not installed."""
    if env_path.is_file():
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, val = line.split("=", 1)
                    key = key.strip()
                    val = val.strip().strip('"').strip("'")
                    if key and not os.getenv(key):
                        os.environ[key] = val

try:
    from dotenv import load_dotenv
    base_dir = Path(__file__).resolve().parent.parent.parent
    load_dotenv(base_dir / "server" / ".env")
    load_dotenv(base_dir / ".env")
except ImportError:
    base_dir = Path(__file__).resolve().parent.parent.parent
    _load_env_file(base_dir / "server" / ".env")
    _load_env_file(base_dir / ".env")

# Also run fallback parsing to guarantee values are present
base_dir = Path(__file__).resolve().parent.parent.parent
_load_env_file(base_dir / "server" / ".env")
_load_env_file(base_dir / ".env")

class Settings:
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    PORT: int = int(os.getenv("PORT", "8000"))
    HOST: str = os.getenv("HOST", "0.0.0.0")
    CORS_ORIGINS: list = [origin.strip() for origin in os.getenv("CORS_ORIGINS", "https://smartresumeanalyze.netlify.app,http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173").split(",") if origin.strip()]

    SUPPORTED_ROLES: list = [
        "Frontend Developer",
        "Backend Developer",
        "Python Developer",
        "React Developer",
        "Full Stack Developer",
        "AI Engineer",
        "Machine Learning Engineer",
        "Data Scientist",
        "Software Engineer",
        "SDE",
        "Web Developer",
        "Django Developer",
        "FastAPI Developer",
        "Node.js Developer",
        "Java Developer",
        "DevOps Engineer",
        "Cloud Engineer"
    ]

settings = Settings()
