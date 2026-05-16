"""Authentication routes for admin."""
from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel
import httpx

from app.config import get_settings

router = APIRouter()
settings = get_settings()


class LoginRequest(BaseModel):
    """Login request."""
    email: str
    password: str


class LoginResponse(BaseModel):
    """Login response."""
    access_token: str
    refresh_token: str
    user: dict


@router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    """Login admin user via goalixa-auth."""
    async with httpx.AsyncClient() as client:
        # Call goalixa-auth login
        response = await client.post(
            f"{settings.auth_service_url}/login",
            json={"email": request.email, "password": request.password},
        )

        if response.status_code != 200:
            raise HTTPException(status_code=401, detail="Invalid credentials")

        data = response.json()
        access_token = data.get("access_token")

        if not access_token:
            raise HTTPException(status_code=401, detail="No access token")

        # Verify admin role via goalixa-auth
        verify_response = await client.get(
            f"{settings.auth_service_url}/me",
            headers={"Authorization": f"Bearer {access_token}"},
        )

        if verify_response.status_code != 200:
            raise HTTPException(status_code=401, detail="Token validation failed")

        user_data = verify_response.json()

        # Check if user is admin
        if user_data.get("role") != "admin":
            raise HTTPException(status_code=403, detail="Not an admin user")

        return LoginResponse(
            access_token=access_token,
            refresh_token=data.get("refresh_token", ""),
            user=user_data,
        )


@router.post("/logout")
async def logout(authorization: str = Header(None)):
    """Logout admin user."""
    return {"message": "Logged out"}


@router.post("/refresh")
async def refresh_token(authorization: str = Header(None)):
    """Refresh admin token."""
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authorization")

    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{settings.auth_service_url}/refresh",
            headers={"Authorization": authorization},
        )

        if response.status_code != 200:
            raise HTTPException(status_code=401, detail="Token refresh failed")

        return response.json()