from __future__ import annotations

from datetime import datetime, timezone

from fastapi import APIRouter, status

from app.helpers import activity_not_found, as_object_id, user_not_found
from app.models import ActivityDocument, RatingDocument, UserDocument
from app.schemas import MessageResponse, RatingRequest


router = APIRouter(prefix="/api/ratings", tags=["ratings"])


@router.post("", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
async def create_rating(payload: RatingRequest):
    activity_object_id = as_object_id(payload.activity_id)
    user_object_id = as_object_id(payload.user_id)

    if activity_object_id is None:
        raise activity_not_found(payload.activity_id)
    if user_object_id is None:
        raise user_not_found(payload.user_id)

    activity = await ActivityDocument.get(activity_object_id)
    if activity is None:
        raise activity_not_found(payload.activity_id)
    user = await UserDocument.get(user_object_id)
    if user is None:
        raise user_not_found(payload.user_id)

    rating = RatingDocument(
        activity_id=activity_object_id,
        user_id=user_object_id,
        score=payload.score,
        comment=payload.comment,
        created_at=datetime.now(timezone.utc),
    )
    await rating.insert()
    return MessageResponse(message="Rating saved successfully.")
