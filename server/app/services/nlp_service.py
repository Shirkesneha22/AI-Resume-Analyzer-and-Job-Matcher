import re
import math
from typing import Dict, List, Set, Tuple

try:
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity
    HAS_SKLEARN = True
except ImportError:
    HAS_SKLEARN = False

SKILL_TAXONOMY: Dict[str, List[str]] = {
    "Frontend": [
        "React", "React.js", "Vue", "Vue.js", "Angular", "Next.js", "Nuxt.js", 
        "TypeScript", "JavaScript", "ES6", "HTML", "HTML5", "CSS", "CSS3", 
        "Tailwind CSS", "Bootstrap", "Redux", "Sass", "Webpack", "Vite", 
        "Framer Motion", "Material UI", "Chakra UI", "WebSockets"
    ],
    "Backend": [
        "Python", "FastAPI", "Django", "Flask", "Node.js", "Express", "Express.js", 
        "Java", "Spring Boot", "C#", ".NET", "Go", "Golang", "PHP", "Laravel", 
        "Ruby", "Ruby on Rails", "GraphQL", "REST API", "gRPC", "Microservices"
    ],
    "Database": [
        "PostgreSQL", "MySQL", "MongoDB", "Redis", "SQLite", "DynamoDB", 
        "Cassandra", "Oracle", "SQL Server", "Supabase", "Firebase", "SQL", 
        "NoSQL", "ORM", "Prisma", "SQLAlchemy"
    ],
    "Cloud": [
        "AWS", "Amazon Web Services", "Azure", "GCP", "Google Cloud Platform", 
        "Cloudflare", "EC2", "S3", "Lambda", "CloudFront", "Heroku", "Render", "Netlify", "Vercel"
    ],
    "DevOps": [
        "Docker", "Kubernetes", "CI/CD", "GitHub Actions", "Jenkins", "Terraform", 
        "Ansible", "Nginx", "Linux", "Bash", "Shell", "Git", "GitLab"
    ],
    "AI/ML": [
        "Python", "PyTorch", "TensorFlow", "Scikit-Learn", "OpenCV", "NLP", 
        "Gemini", "Gemini API", "OpenAI", "LangChain", "LlamaIndex", "Hugging Face", 
        "RAG", "Vector DB", "ChromaDB", "Pinecone", "Deep Learning", "Machine Learning"
    ],
    "Tools": [
        "Git", "GitHub", "Postman", "Swagger", "Jira", "Confluence", "Figma", 
        "VS Code", "Docker Desktop", "npm", "yarn", "pip", "PyCharm"
    ],
    "Soft Skills": [
        "Leadership", "Communication", "Problem Solving", "Teamwork", 
        "Agile", "Scrum", "Critical Thinking", "Adaptability", "Time Management", "Collaboration"
    ]
}

REQUIRED_SECTIONS = [
    "Summary", "Experience", "Education", "Projects", 
    "Certifications", "Achievements", "GitHub", "Portfolio"
]

ACTION_VERBS = [
    "built", "developed", "architected", "designed", "implemented", "scaled",
    "optimized", "managed", "led", "launched", "created", "reduced", "increased",
    "automated", "integrated", "engineered", "championed", "revamped"
]

class NLPService:
    @staticmethod
    def extract_categorized_skills(text: str) -> Tuple[Dict[str, List[str]], Set[str]]:
        text_lower = text.lower()
        found_categories: Dict[str, List[str]] = {}
        all_found_skills: Set[str] = set()

        for category, skills in SKILL_TAXONOMY.items():
            category_matches = []
            for skill in skills:
                pattern = r'\b' + re.escape(skill.lower()) + r'\b'
                if re.search(pattern, text_lower):
                    if skill not in category_matches:
                        category_matches.append(skill)
                        all_found_skills.add(skill)
            if category_matches:
                found_categories[category] = category_matches

        return found_categories, all_found_skills

    @staticmethod
    def audit_resume_sections(text: str, contact_info: Dict) -> Dict[str, List[str]]:
        text_lower = text.lower()
        present = []
        missing = []

        section_keywords = {
            "Summary": ["summary", "profile", "objective", "about me"],
            "Experience": ["experience", "work history", "employment", "internship"],
            "Education": ["education", "academic", "university", "college", "degree"],
            "Projects": ["projects", "personal projects", "key projects"],
            "Certifications": ["certifications", "certificates", "courses", "licenses"],
            "Achievements": ["achievements", "awards", "honors", "accomplishments"]
        }

        for section, keywords in section_keywords.items():
            if any(re.search(r'\b' + re.escape(kw) + r'\b', text_lower) for kw in keywords):
                present.append(section)
            else:
                missing.append(section)

        if contact_info.get("github") or "github.com" in text_lower:
            present.append("GitHub")
        else:
            missing.append("GitHub")

        if contact_info.get("portfolio") or "portfolio" in text_lower or contact_info.get("linkedin"):
            present.append("Portfolio")
        else:
            missing.append("Portfolio")

        return {
            "present_sections": present,
            "missing_sections": missing
        }

    @staticmethod
    def evaluate_resume_health(text: str, contact_info: Dict, section_audit: Dict) -> Dict:
        words = text.split()
        word_count = len(words)
        text_lower = text.lower()
        action_verb_count = sum(1 for verb in ACTION_VERBS if re.search(r'\b' + verb + r'\b', text_lower))
        metrics_count = len(re.findall(r'\b(?:\d+%\b|\$\d+|\d+x\b|\d+\+\b|\d+ users|\d+ ms)', text_lower))

        checklist = {
            "grammar": word_count > 100 and word_count < 1200,
            "formatting": len(section_audit["present_sections"]) >= 4,
            "length": 250 <= word_count <= 850,
            "projects": "Projects" in section_audit["present_sections"],
            "achievements": "Achievements" in section_audit["present_sections"],
            "action_verbs": action_verb_count >= 3,
            "numbers_used": metrics_count >= 2,
            "contact_details": bool(contact_info.get("email") or contact_info.get("phone")),
            "linkedin": bool(contact_info.get("linkedin")),
            "portfolio": bool(contact_info.get("portfolio")),
            "github": bool(contact_info.get("github")),
        }

        true_count = sum(1 for v in checklist.values() if v)
        star_rating = round(max(1.0, min(5.0, (true_count / len(checklist)) * 5.0)), 1)

        return {
            "stars": star_rating,
            "checklist": checklist
        }

    @staticmethod
    def compute_tfidf_keyword_score(resume_text: str, jd_text: str) -> Tuple[float, List[Dict]]:
        """Calculate TF-IDF similarity score (0-100) and keyword density comparison with pure Python fallback."""
        if HAS_SKLEARN:
            try:
                vectorizer = TfidfVectorizer(stop_words='english', max_features=50)
                tfidf_matrix = vectorizer.fit_transform([resume_text, jd_text])
                similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
                similarity_score = round(float(similarity) * 100, 1)

                feature_names = vectorizer.get_feature_names_out()
                dense_resume = tfidf_matrix[0].toarray()[0]
                dense_jd = tfidf_matrix[1].toarray()[0]

                keyword_density = []
                for idx, feature in enumerate(feature_names):
                    r_val = int(dense_resume[idx] > 0)
                    j_val = int(dense_jd[idx] > 0)
                    keyword_density.append({
                        "keyword": feature,
                        "resume_count": r_val,
                        "jd_count": j_val,
                        "status": "matched" if (r_val and j_val) else "missing"
                    })

                keyword_density = sorted(keyword_density, key=lambda x: x["jd_count"], reverse=True)[:15]
                return similarity_score, keyword_density
            except Exception:
                pass

        # Pure Python fallback TF-IDF / Jaccard calculation
        words_r = set(re.findall(r'\b[a-zA-Z]{3,}\b', resume_text.lower()))
        words_j = set(re.findall(r'\b[a-zA-Z]{3,}\b', jd_text.lower()))

        stopwords = {"and", "the", "for", "with", "that", "this", "from", "are", "have", "you", "your", "will", "all"}
        words_r = words_r - stopwords
        words_j = words_j - stopwords

        intersection = words_r.intersection(words_j)
        score = round((len(intersection) / max(1, len(words_j))) * 100, 1) if words_j else 60.0

        density = [
            {
                "keyword": w,
                "resume_count": 1 if w in words_r else 0,
                "jd_count": 1,
                "status": "matched" if w in words_r else "missing"
            }
            for w in list(words_j)[:15]
        ]
        return min(100.0, max(20.0, score)), density

nlp_service = NLPService()
