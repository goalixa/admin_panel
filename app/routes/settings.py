"""Settings routes."""
from fastapi import APIRouter, HTTPException, Header, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import Optional

from app.database import get_db
from app.models import SystemSetting

router = APIRouter()


class SettingsResponse(BaseModel):
    """Settings response."""
    site_name: str
    allow_registration: bool
    require_email_verification: bool


class SettingsUpdate(BaseModel):
    """Settings update."""
    site_name: Optional[str] = None
    allow_registration: Optional[bool] = None
    require_email_verification: Optional[bool] = None


def get_setting(db: Session, key: str, default: str) -> str:
    setting = db.query(SystemSetting).filter(SystemSetting.key == key).first()
    if setting:
        return setting.value
    return default


def set_setting(db: Session, key: str, value: str, type: str = "str"):
    setting = db.query(SystemSetting).filter(SystemSetting.key == key).first()
    if setting:
        setting.value = value
    else:
        setting = SystemSetting(key=key, value=value, type=type)
        db.add(setting)
    db.commit()


@router.get("", response_model=SettingsResponse)
async def get_settings(db: Session = Depends(get_db)):
    """Get system settings."""
    return SettingsResponse(
        site_name=get_setting(db, "site_name", "Goalixa"),
        allow_registration=get_setting(db, "allow_registration", "true").lower() == "true",
        require_email_verification=get_setting(db, "require_email_verification", "true").lower() == "true",
    )


@router.put("", response_model=SettingsResponse)
async def update_settings(update: SettingsUpdate, db: Session = Depends(get_db)):
    """Update system settings."""
    if update.site_name is not None:
        set_setting(db, "site_name", update.site_name)
    if update.allow_registration is not None:
        set_setting(db, "allow_registration", str(update.allow_registration).lower())
    if update.require_email_verification is not None:
        set_setting(db, "require_email_verification", str(update.require_email_verification).lower())

    return await get_settings(db)