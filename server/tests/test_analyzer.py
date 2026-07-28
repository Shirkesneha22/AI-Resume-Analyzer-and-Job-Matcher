from app.services.nlp_service import nlp_service
from app.services.analyzer_service import analyzer_service

def test_nlp_extract_skills():
    text = "Experienced React and Python developer proficient in FastAPI, Docker, and AWS."
    cat, skills = nlp_service.extract_categorized_skills(text)
    assert "React" in skills or "Python" in skills
    assert "Frontend" in cat or "Backend" in cat

def test_analyzer_weighted_score():
    resume_text = "John Doe john@example.com Senior Software Engineer with React, Python, FastAPI, Docker, PostgreSQL."
    jd_text = "Looking for a Full Stack Developer with React, Python, FastAPI, Docker, PostgreSQL experience."
    res = analyzer_service.analyze_resume(resume_text, jd_text)
    assert res["score"] > 0
    assert "skill_score" in res
    assert "resume_health" in res
    print("Test passed! Overall score:", res["score"])

if __name__ == "__main__":
    test_nlp_extract_skills()
    test_analyzer_weighted_score()
