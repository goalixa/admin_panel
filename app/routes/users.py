"""User management routes."""
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Header, Query
from pydantic import BaseModel
import httpx

from app.config import get_settings

router = APIRouter()
settings = get_settings()


class UserResponse(BaseModel):
    """User response."""
    id: int
    email: str
    active: bool
    email_verified: bool
    created_at: Optional[str] = None
    last_login: Optional[str] = None


class UserListResponse(BaseModel):
    """User list response."""
    users: List[UserResponse]
    total: int
    page: int
    per_page: int


def get_auth_headers(authorization: str = None):
    """Get authorization headers for service calls."""
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authorization")
    return {"Authorization": authorization}


@router.get("", response_model=UserListResponse)
async def list_users(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    active: Optional[bool] = None,
    authorization: str = Header(None),
):
    """List all users with pagination."""
    headers = get_auth_headers(authorization)

    # Call Core-API to get users
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{settings.core_api_url}/api/users",
            params={"page": page, "per_page": per_page},
            headers=headers,
        )

        if response.status_code != 200:
            # Return empty list if API unavailable
            return UserListResponse(
                users=[],
                total=0,
                page=page,
                per_page=per_page,
            )

        data = response.json()
        return UserListResponse(
            users=[UserResponse(**u) for u in data.get("users", [])],
            total=data.get("total", 0),
            page=page,
            per_page=per_page,
        )


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: int,
    authorization: str = Header(None),
):
    """Get user details."""
    headers = get_auth_headers(authorization)

    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{settings.core_api_url}/api/users/{user_id}",
            headers=headers,
        )

        if response.status_code == 404:
            raise HTTPException(status_code=404, detail="User not found")
        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="Failed to fetch user")

        return UserResponse(**response.json())


@router.post("/{user_id}/disable")
async def disable_user(
    user_id: int,
    authorization: str = Header(None),
):
    """Disable a user."""
    headers = get_auth_headers(authorization)

    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{settings.core_api_url}/api/users/{user_id}/disable",
            headers=headers,
        )

        if response.status_code == 404:
            raise HTTPException(status_code=404, detail="User not found")
        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="Failed to disable user")

        return {"message": "User disabled", "user_id": user_id}


@router.post("/{user_id}/enable")
async def enable_user(
    user_id: int,
    authorization: str = Header(None),
):
    """Enable a user."""
    headers = get_auth_headers(authorization)

    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{settings.core_api_url}/api/users/{user_id}/enable",
            headers=headers,
        )

        if response.status_code == 404:
            raise HTTPException(status_code=404, detail="User not found")
        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="Failed to enable user")

        return {"message": "User enabled", "user_id": user_id}


@router.delete("/{user_id}")
async def delete_user(
    user_id: int,
    authorization: str = Header(None),
):
    """Delete a user."""
    headers = get_auth_headers(authorization)

    async with httpx.AsyncClient() as client:
        response = await client.delete(
            f"{settings.core_api_url}/api/users/{user_id}",
            headers=headers,
        )

        if response.status_code == 404:
            raise HTTPException(status_code=404, detail="User not found")
        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="Failed to delete user")

        return {"message": "User deleted", "user_id": user_id}