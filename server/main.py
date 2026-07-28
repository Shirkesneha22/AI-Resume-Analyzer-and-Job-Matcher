import traceback
import uvicorn
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.config.config import settings
from app.api.endpoints import router as api_router

app = FastAPI(
    title="AI Resume Analyzer & Job Matcher API",
    description="Production FastAPI backend for AI Resume analysis, weighted ATS scoring, skill heatmaps, and role-based JD generation.",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(Exception)
async def debug_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "error": str(exc),
            "type": type(exc).__name__,
            "traceback": traceback.format_exc(),
        },
    )

# Include API Router
app.include_router(api_router)

@app.get("/")
def root():
    return {
        "app": "AI Resume Analyzer & Job Matcher",
        "docs": "/docs",
        "health": "/api/v1/health"
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=True)
