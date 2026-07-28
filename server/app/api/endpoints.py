from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status
from typing import Optional
from app.config.config import settings
from app.services.pdf_service import pdf_service
from app.services.gemini_service import gemini_service
from app.services.analyzer_service import analyzer_service
from app.services.nlp_service import nlp_service
from app.utils.helpers import extract_contact_info
from app.schemas.analysis_schema import (
    AnalysisResponse, 
    GenerateJDRequest, 
    GenerateJDResponse
)

router = APIRouter(prefix="/api/v1", tags=["Resume Analyzer"])

@router.get("/health")
def health_check():
    """Health check endpoint checking server and Gemini API configuration."""
    return {
        "status": "healthy",
        "gemini_api_configured": gemini_service.is_configured,
        "supported_roles_count": len(settings.SUPPORTED_ROLES)
    }

@router.get("/roles")
def get_roles():
    """Return pre-configured supported technical roles."""
    return {"roles": settings.SUPPORTED_ROLES}

@router.post("/extract-resume")
async def extract_resume(file: UploadFile = File(...)):
    """Extract raw text and contact info from PDF resume in-memory."""
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Only PDF resume files are supported."
        )
    
    contents = await file.read()
    raw_text = pdf_service.extract_text_from_pdf_bytes(contents)
    contact_info = extract_contact_info(raw_text)
    section_audit = nlp_service.audit_resume_sections(raw_text, contact_info)

    return {
        "filename": file.filename,
        "raw_text": raw_text,
        "contact_info": contact_info,
        "section_audit": section_audit
    }

@router.post("/generate-jd", response_model=GenerateJDResponse)
def generate_jd(payload: GenerateJDRequest):
    """Generate professional Job Description for a selected role using Gemini API."""
    if not payload.role:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Role parameter is required."
        )
    
    jd = gemini_service.generate_job_description(payload.role)
    return GenerateJDResponse(role=payload.role, job_description=jd)

@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_resume(
    file: UploadFile = File(...),
    job_description: Optional[str] = Form(None),
    role: Optional[str] = Form(None)
):
    """
    Main endpoint:
    - Parses PDF in-memory.
    - Generates JD if role specified and JD is blank.
    - Evaluates weighted multi-factor ATS score, skill heatmap, section audit, and Gemini recommendations.
    """
    # 1. Validate PDF file
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Invalid file format. Please upload a PDF file."
        )

    pdf_bytes = await file.read()
    if len(pdf_bytes) > 10 * 1024 * 1024:  # 10MB limit
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File size exceeds maximum allowed limit of 10MB."
        )

    # 2. Extract PDF text
    resume_text = pdf_service.extract_text_from_pdf_bytes(pdf_bytes)

    # 3. Determine target Job Description
    target_jd = ""
    if job_description and job_description.strip():
        target_jd = job_description.strip()
    elif role and role.strip():
        target_jd = gemini_service.generate_job_description(role.strip())
    else:
        # Default to Full Stack Developer if neither provided
        target_jd = gemini_service.generate_job_description("Full Stack Developer")

    # 4. Perform complete analysis
    result = analyzer_service.analyze_resume(resume_text, target_jd)
    return result
