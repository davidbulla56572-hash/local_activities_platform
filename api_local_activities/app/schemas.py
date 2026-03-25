from __future__ import annotations

from datetime import date

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


def to_camel(value: str) -> str:
    parts = value.split("_")
    return parts[0] + "".join(part.capitalize() for part in parts[1:])


class CamelModel(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        str_strip_whitespace=True,
    )


class UserRequest(CamelModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr = Field(max_length=120)
    password: str = Field(min_length=6, max_length=120)


class UserResponse(CamelModel):
    id: str
    name: str
    email: str


class ActivityRequest(CamelModel):
    name: str = Field(min_length=1, max_length=120)
    description: str = Field(min_length=1, max_length=800)
    location: str = Field(min_length=1, max_length=150)
    event_date: date
    category: str = Field(min_length=1, max_length=60)
    creator_id: str | None = None

    @field_validator("event_date")
    @classmethod
    def validate_event_date(cls, value: date) -> date:
        if value < date.today():
            raise ValueError("Event date must be today or in the future.")
        return value


class ActivityResponse(CamelModel):
    id: str
    name: str
    description: str
    location: str
    event_date: date
    category: str
    creator_id: str | None
    creator_name: str | None
    average_rating: float
    rating_count: int


class RatingRequest(CamelModel):
    activity_id: str
    user_id: str
    score: int = Field(ge=1, le=5)
    comment: str | None = Field(default=None, max_length=300)


class MessageResponse(CamelModel):
    message: str
