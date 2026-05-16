"""Main FastAPI application for admin service."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from prometheus_client import generate_latest, CONTENT_TYPE_LATEST

from app.config import get_settings
from app.routes import auth, users, analytics, health, settings as settings_router

settings = get_settings()

app = FastAPI(
    title="Goalixa Admin API",
    description="Admin panel API for Goalixa platform management",
    version="1.0.0",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Root endpoint."""
    return {"message": "Goalixa Admin API", "version": "1.0.0"}


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


@app.get("/metrics")
async def metrics():
    """Metrics endpoint."""
    return {"content_type": CONTENT_TYPE_LATEST, "data": generate_latest().decode()}


# Include routers
app.include_router(auth.router, prefix="/admin/api/auth", tags=["auth"])
app.include_router(users.router, prefix="/admin/api/users", tags=["users"])
app.include_router(analytics.router, prefix="/admin/api/analytics", tags=["analytics"])
app.include_router(health.router, prefix="/admin/api/health", tags=["health"])
app.include_router(settings_router.router, prefix="/admin/api/settings", tags=["settings"])


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=settings.host, port=settings.port)