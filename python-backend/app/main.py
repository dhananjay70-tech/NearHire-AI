from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timezone

from app.config import settings
from app.api.health import router as health_router
from app.api.resume import router as resume_router
from app.api.recommendations import router as recommendations_router
from app.api.agent import router as agent_router


# ─── App Initialization ───────────────────────────────────────────────────────
app = FastAPI(
    title="NearHire.AI — Python Backend",
    description="AI-powered backend for hyperlocal job discovery",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ─── CORS ─────────────────────────────────────────────────────────────────────
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=[settings.CORS_ORIGIN],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# ─── Root Health Check ────────────────────────────────────────────────────────
@app.get("/health", tags=["Health"], summary="Root Health Check")
async def root_health():
    """Returns the health status of the Python backend."""
    return {
        "status": "ok",
        "service": "nearhire-python-backend",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }

# ─── API Routers ──────────────────────────────────────────────────────────────
app.include_router(health_router, prefix="/api")
app.include_router(resume_router, prefix="/api")
app.include_router(recommendations_router, prefix="/api")
app.include_router(agent_router, prefix="/api")
