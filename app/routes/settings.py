"""Settings routes."""
from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel

router = APIRouter()


class SettingsResponse(BaseModel):
    """Settings response."""
    site_name: str = "Goalixa"
    allow_registration: bool = True
    require_email_verification: bool = True


class SettingsUpdate(BaseModel):
    """Settings update."""
    site_name: str = None
    allow_registration: bool = None
    require_email_verification: bool = None


# In-memory settings (replace with database in production)
_settings = SettingsResponse()


@router.get("", response_model=SettingsResponse)
async def get_settings():
    """Get system settings."""
    return _settings


@router.put("", response_model=SettingsResponse)
async def update_settings(update: SettingsUpdate):
    """Update system settings."""
    global _settings

    if update.site_name is not None:
        _settings.site_name = update.site_name
    if update.allow_registration is not None:
        _settings.allow_registration = update.allow_registration
    if update.require_email_verification is not None:
        _settings.require_email_verification = update.require_email_verification

    return _settings