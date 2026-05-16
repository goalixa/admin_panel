"""System health routes."""
import httpx
from fastapi import APIRouter
from pydantic import BaseModel
from app.config import get_settings

router = APIRouter()
settings = get_settings()


class ServiceHealth(BaseModel):
    """Service health status."""
    name: str
    status: str  # healthy, degraded, down
    latency_ms: int = 0


class HealthResponse(BaseModel):
    """Health response."""
    status: str
    services: list[ServiceHealth]


@router.get("", response_model=HealthResponse)
async def get_health():
    """Get system health status."""
    services = []
    overall_status = "healthy"

    # Check auth service
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{settings.auth_service_url}/health", timeout=5.0)
            if response.status_code == 200:
                services.append(ServiceHealth(name="auth", status="healthy"))
            else:
                services.append(ServiceHealth(name="auth", status="degraded"))
                overall_status = "degraded"
    except Exception:
        services.append(ServiceHealth(name="auth", status="down"))
        overall_status = "degraded"

    # Check Core-API
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{settings.core_api_url}/health", timeout=5.0)
            if response.status_code == 200:
                services.append(ServiceHealth(name="core-api", status="healthy"))
            else:
                services.append(ServiceHealth(name="core-api", status="degraded"))
                overall_status = "degraded"
    except Exception:
        services.append(ServiceHealth(name="core-api", status="down"))
        overall_status = "degraded"

    return HealthResponse(status=overall_status, services=services)


@router.get("/services")
async def get_service_status():
    """Get individual service status."""
    return await get_health()