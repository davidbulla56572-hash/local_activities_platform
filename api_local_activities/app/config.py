from __future__ import annotations

from functools import lru_cache
from urllib.parse import urlparse

from pydantic import AliasChoices, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "local-activities-api"
    app_port: int = 8080
    mongodb_uri: str = Field(
        default="mongodb://localhost:27017/activities",
        validation_alias=AliasChoices("MONGODB_URI", "DATABASE_URL"),
    )
    mongodb_db: str | None = Field(
        default=None,
        validation_alias=AliasChoices("MONGODB_DB", "DATABASE_NAME"),
    )
    env: str = "dev"
    seed_data: bool = True
    cors_origins_raw: str = Field(
        default="",
        validation_alias=AliasChoices("CORS_ORIGINS", "EXTRA_CORS_ORIGINS"),
    )

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    @property
    def cors_origins(self) -> list[str]:
        return [item.strip() for item in self.cors_origins_raw.split(",") if item.strip()]

    @property
    def database_name(self) -> str:
        if self.mongodb_db:
            return self.mongodb_db.strip()
        path = urlparse(self.mongodb_uri).path.strip("/")
        return path or "activities"


@lru_cache
def get_settings() -> Settings:
    return Settings()
