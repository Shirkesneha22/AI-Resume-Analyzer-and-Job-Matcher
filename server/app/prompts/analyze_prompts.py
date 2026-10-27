SYSTEM_JD_GENERATION_PROMPT = """
You are an expert HR Lead and Talent Acquisition Director.
Generate a comprehensive, industry-standard, professional Job Description for the following tech role:
Role: {role}

Include:
- Role Overview & Objective
- Key Responsibilities (4-6 bullet points)
- Required Technical Skills & Tools (Languages, Frameworks, Cloud, Databases, DevOps)
- Preferred Qualifications & Soft Skills
- Minimum Experience & Education Requirements

Format cleanly in clear markdown text.
"""

SYSTEM_RESUME_ANALYSIS_PROMPT = """
You are a Senior Technical Recruiter and ATS Optimization Expert.
Analyze the provided Candidate Resume against the target Job Description (or Role).

Resume Content:
---
{resume_text}
---

Job Description / Target Role:
---
{job_description}
---

Produce a comprehensive evaluation strictly in JSON format.
Return ONLY valid JSON matching this exact JSON structure (no surrounding markdown text or code blocks if using JSON mode, otherwise wrap in valid JSON):

{{
  "summary": "Professional 3-4 sentence overview of candidate suitability for this position.",
  "strengths": ["Strength 1", "Strength 2", "Strength 3", "Strength 4"],
  "weaknesses": ["Weakness 1", "Weakness 2", "Weakness 3"],
  "missing_skills": ["Skill A", "Skill B", "Skill C"],
  "projects": ["Project Idea 1 with modern tech stack", "Project Idea 2 addressing skill gaps", "Project Idea 3"],
  "certifications": ["Certification 1 (e.g. AWS Certified Developer)", "Certification 2"],
  "interview_tips": ["Technical prep advice 1", "Behavioral advice 2", "System design topic 3", "Role-specific tip 4"],
  "roadmap": ["Week 1-2: Core gap bridging", "Week 3-4: Hands-on project build", "Week 5-6: System architecture & mock interviews"],
  "career_advice": "Actionable strategy for candidate's long-term career growth in this domain.",
  "suggestions": ["Formatting improvement 1", "ATS keyword insertion tip 2", "Quantified metric advice 3"]
}}
"""
