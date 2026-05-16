"""Configuration for admin service."""
import os
from functools import lru_cache
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings."""

    # Admin
    admin_secret_key: str = os.getenv("ADMIN_SECRET_KEY", "change-me")
    admin_jwt_secret: str = os.getenv("AUTH_JWT_SECRET", "change-me")

    # Services
    auth_service_url: str = os.getenv("AUTH_SERVICE_URL", "http://localhost:8000")
    core_api_url: str = os.getenv("CORE_API_URL", "http://localhost:8000")

    # Database
    database_url: str = os.getenv("DATABASE_URL", "postgresql://goalixa:goalixa@localhost:5432/goalixa_admin")

    # Redis
    redis_url: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")

    # Server
    host: str = os.getenv("HOST", "0.0.0.0")
    port: int = int(os.getenv("PORT", "80"))

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings."""
    return Settings()