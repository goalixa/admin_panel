"""Analytics routes."""
import httpx
from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel

from app.config import get_settings

router = APIRouter()
settings = get_settings()


class AnalyticsResponse(BaseModel):
    """Analytics response."""
    total_users: int = 0
    active_users: int = 0
    inactive_users: int = 0
    new_users_today: int = 0
    new_users_week: int = 0
    new_users_month: int = 0
    total_tasks: int = 0
    completed_tasks: int = 0
    total_projects: int = 0


@router.get("", response_model=AnalyticsResponse)
async def get_analytics(authorization: str = Header(None)):
    """Get user analytics."""
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authorization")

    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{settings.core_api_url}/api/analytics",
            headers={"Authorization": authorization},
        )

        if response.status_code != 200:
            return AnalyticsResponse()

        return AnalyticsResponse(**response.json())


@router.get("/logins")
async def get_login_history(
    page: int = 1,
    per_page: int = 20,
    authorization: str = Header(None),
):
    """Get login history."""
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authorization")

    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{settings.core_api_url}/api/analytics/logins",
            params={"page": page, "per_page": per_page},
            headers={"Authorization": authorization},
        )

        if response.status_code != 200:
            return {"logins": [], "total": 0}

        return response.json()


@router.get("/activity")
async def get_activity(authorization: str = Header(None)):
    """Get user activity data."""
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authorization")

    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{settings.core_api_url}/api/analytics/activity",
            headers={"Authorization": authorization},
        )

        if response.status_code != 200:
            return {"activity": []}

        return response.json()


@router.get("/tasks")
async def get_task_analytics(authorization: str = Header(None)):
    """Get task activity data."""
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authorization")

    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{settings.core_api_url}/api/analytics/tasks",
            headers={"Authorization": authorization},
        )

        if response.status_code != 200:
            return {"task_activity": []}

        return response.json()