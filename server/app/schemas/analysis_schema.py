from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any

class SkillHeatmapItem(BaseModel):
    name: str
    category: str
    status: str  # "matched" | "partial" | "missing"

class HealthChecklist(BaseModel):
    grammar: bool
    formatting: bool
    length: bool
    projects: bool
    achievements: bool
    action_verbs: bool
    numbers_used: bool
    contact_details: bool
    linkedin: bool
    portfolio: bool
    github: bool

class ResumeHealth(BaseModel):
    stars: float
    checklist: HealthChecklist

class SectionAudit(BaseModel):
    present_sections: List[str]
    missing_sections: List[str]

class KeywordDensityItem(BaseModel):
    keyword: str
    resume_count: int
    jd_count: int
    status: str  # "matched" | "missing"

class AnalysisResponse(BaseModel):
    score: float = Field(..., description="Overall Weighted ATS Score 0-100")
    skill_score: float = Field(..., description="Skills Match (40%)")
    experience_score: float = Field(..., description="Experience Match (20%)")
    education_score: float = Field(..., description="Education Match (10%)")
    keyword_score: float = Field(..., description="Keyword Match (20%)")
    formatting_score: float = Field(..., description="Resume Quality/Formatting (10%)")
    
    resume_health: ResumeHealth
    sections_audit: SectionAudit
    skill_heatmap: List[SkillHeatmapItem]
    skill_categories: Dict[str, List[str]]
    
    matched_skills: List[str]
    missing_skills: List[str]
    strengths: List[str]
    weaknesses: List[str]
    
    summary: str
    suggestions: List[str]
    projects: List[str]
    certifications: List[str]
    interview_tips: List[str]
    roadmap: List[str]
    career_advice: str
    
    keyword_density: List[KeywordDensityItem]
    ats_compatibility_meter: int
    job_readiness_meter: int
    
    parsed_contact_info: Dict[str, Optional[str]]
    job_description_used: str

class GenerateJDRequest(BaseModel):
    role: str

class GenerateJDResponse(BaseModel):
    role: str
    job_description: str
