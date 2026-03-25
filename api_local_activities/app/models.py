from __future__ import annotations

from datetime import date, datetime, timezone

from beanie import Document, Indexed, PydanticObjectId
from pydantic import EmailStr, Field
from pymongo import ASCENDING, IndexModel


class UserDocument(Document):
    name: str = Field(max_length=100)
    email: EmailStr = Field(max_length=120)
    email_normalized: Indexed(str, unique=True)
    password: str = Field(min_length=6, max_length=120)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "users"


class ActivityDocument(Document):
    name: str = Field(max_length=120)
    description: str = Field(max_length=800)
    location: str = Field(max_length=150)
    event_date: date
    category: str = Field(max_length=60)
    creator_id: PydanticObjectId | None = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "activities"
        indexes = [
            IndexModel([("category", ASCENDING)]),
            IndexModel([("event_date", ASCENDING)]),
        ]


class RatingDocument(Document):
    activity_id: PydanticObjectId
    user_id: PydanticObjectId
    score: int = Field(ge=1, le=5)
    comment: str | None = Field(default=None, max_length=300)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "ratings"
        indexes = [
            IndexModel([("activity_id", ASCENDING)]),
            IndexModel([("user_id", ASCENDING)]),
        ]
