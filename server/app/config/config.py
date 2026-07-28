import os

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

class Settings:
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    PORT: int = int(os.getenv("PORT", "8000"))
    HOST: str = os.getenv("HOST", "0.0.0.0")
    CORS_ORIGINS: list = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173").split(",")

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
