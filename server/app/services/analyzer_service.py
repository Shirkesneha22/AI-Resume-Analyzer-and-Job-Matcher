import re
from typing import Dict, List, Set
from app.services.nlp_service import nlp_service, SKILL_TAXONOMY
from app.services.gemini_service import gemini_service
from app.utils.helpers import extract_contact_info

class AnalyzerService:
    @staticmethod
    def analyze_resume(resume_text: str, job_description: str) -> Dict:
        # 1. Contact Info Extraction
        contact_info = extract_contact_info(resume_text)

        # 2. Skill Extraction & Categorization for Resume and JD
        resume_cat_skills, resume_skills_set = nlp_service.extract_categorized_skills(resume_text)
        jd_cat_skills, jd_skills_set = nlp_service.extract_categorized_skills(job_description)

        # 3. Section Audit & Resume Health
        section_audit = nlp_service.audit_resume_sections(resume_text, contact_info)
        resume_health = nlp_service.evaluate_resume_health(resume_text, contact_info, section_audit)

        # 4. TF-IDF Keyword Score & Density
        tfidf_score, keyword_density = nlp_service.compute_tfidf_keyword_score(resume_text, job_description)

        # 5. Gemini AI Analysis
        ai_result = gemini_service.analyze_resume_with_ai(resume_text, job_description)

        # 6. Skill Matching Logic & Heatmap
        if jd_skills_set:
            matched_skills_set = resume_skills_set.intersection(jd_skills_set)
            missing_skills_set = jd_skills_set.difference(resume_skills_set)
            skill_match_ratio = len(matched_skills_set) / len(jd_skills_set)
        else:
            matched_skills_set = resume_skills_set
            missing_skills_set = set(ai_result.get("missing_skills", []))
            skill_match_ratio = 0.75 if len(resume_skills_set) >= 5 else 0.5

        matched_skills = sorted(list(matched_skills_set))
        missing_skills = sorted(list(missing_skills_set))

        # Skill Heatmap building
        skill_heatmap = []
        # Add all JD skills with matched status
        for cat, cat_skills in SKILL_TAXONOMY.items():
            for sk in cat_skills:
                if sk in matched_skills:
                    skill_heatmap.append({"name": sk, "category": cat, "status": "matched"})
                elif sk in missing_skills:
                    skill_heatmap.append({"name": sk, "category": cat, "status": "missing"})

        # If heatmap has few elements, pad with top candidate skills
        if len(skill_heatmap) < 6:
            for sk in resume_skills_set:
                if not any(item["name"] == sk for item in skill_heatmap):
                    skill_heatmap.append({"name": sk, "category": "General", "status": "matched"})

        # 7. Multi-Factor ATS Scoring Formula
        # Skill Score (40%)
        skill_score = round(min(100.0, max(20.0, skill_match_ratio * 100.0)), 1)
        
        # Experience Score (20%): Based on presence of experience section, action verbs, metrics
        exp_score_base = 80.0 if "Experience" in section_audit["present_sections"] else 40.0
        exp_score = min(100.0, exp_score_base + (20.0 if resume_health["checklist"]["action_verbs"] else 0.0))

        # Education Score (10%): Based on presence of education section
        edu_score = 90.0 if "Education" in section_audit["present_sections"] else 50.0

        # Keyword Match Score (20%): Weighted average of TF-IDF and skill ratio
        keyword_score = round((tfidf_score * 0.5) + (skill_score * 0.5), 1)

        # Formatting / Quality Score (10%): Based on health star rating
        formatting_score = round(resume_health["stars"] * 20.0, 1)

        # Final Weighted ATS Score Formula:
        # Final Score = 0.4*Skill + 0.2*Experience + 0.1*Education + 0.2*Keywords + 0.1*Formatting
        final_score = round(
            (0.4 * skill_score) +
            (0.2 * exp_score) +
            (0.1 * edu_score) +
            (0.2 * keyword_score) +
            (0.1 * formatting_score),
            1
        )
        final_score = min(100.0, max(0.0, final_score))

        # Readiness and ATS meters
        ats_compatibility_meter = int(min(100, max(10, final_score)))
        job_readiness_meter = int(min(100, max(10, (skill_score * 0.6) + (exp_score * 0.4))))

        return {
            "score": final_score,
            "skill_score": skill_score,
            "experience_score": exp_score,
            "education_score": edu_score,
            "keyword_score": keyword_score,
            "formatting_score": formatting_score,
            "resume_health": resume_health,
            "sections_audit": section_audit,
            "skill_heatmap": skill_heatmap,
            "skill_categories": resume_cat_skills,
            "matched_skills": matched_skills,
            "missing_skills": missing_skills,
            "strengths": ai_result.get("strengths", []),
            "weaknesses": ai_result.get("weaknesses", []),
            "summary": ai_result.get("summary", ""),
            "suggestions": ai_result.get("suggestions", []),
            "projects": ai_result.get("projects", []),
            "certifications": ai_result.get("certifications", []),
            "interview_tips": ai_result.get("interview_tips", []),
            "roadmap": ai_result.get("roadmap", []),
            "career_advice": ai_result.get("career_advice", ""),
            "keyword_density": keyword_density,
            "ats_compatibility_meter": ats_compatibility_meter,
            "job_readiness_meter": job_readiness_meter,
            "parsed_contact_info": contact_info,
            "job_description_used": job_description
        }

analyzer_service = AnalyzerService()
