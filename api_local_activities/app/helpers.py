from __future__ import annotations

from fastapi import HTTPException
from fastapi.exceptions import RequestValidationError
from beanie import PydanticObjectId

from app.models import ActivityDocument, RatingDocument, UserDocument
from app.schemas import ActivityResponse, to_camel


def as_object_id(value: str | None) -> PydanticObjectId | None:
    if value is None or value == "":
        return None
    try:
        return PydanticObjectId(value)
    except Exception:
        return None


def validation_error_to_map(exc: RequestValidationError) -> dict[str, str]:
    data: dict[str, str] = {}
    for error in exc.errors():
        loc = error.get("loc", [])
        field_name = "detail"
        if len(loc) >= 2 and loc[0] == "body":
            field_name = str(loc[1])
        elif loc:
            field_name = str(loc[-1])
        data[to_camel(field_name)] = error.get("msg", "Invalid value.")
    return data or {"detail": "Invalid request payload."}


def activity_not_found(activity_id: str) -> HTTPException:
    return HTTPException(
        status_code=404,
        detail={"message": f"Activity {activity_id} was not found."},
    )


def user_not_found(user_id: str) -> HTTPException:
    return HTTPException(
        status_code=404,
        detail={"message": f"User {user_id} was not found."},
    )


async def build_activity_response(activity: ActivityDocument) -> ActivityResponse:
    ratings = await RatingDocument.find(RatingDocument.activity_id == activity.id).to_list()
    rating_count = len(ratings)
    average = 0.0
    if rating_count > 0:
        average = round(sum(item.score for item in ratings) / rating_count, 1)

    creator_name = None
    creator_id = str(activity.creator_id) if activity.creator_id else None
    if activity.creator_id:
        creator = await UserDocument.get(activity.creator_id)
        if creator:
            creator_name = creator.name

    return ActivityResponse(
        id=str(activity.id),
        name=activity.name,
        description=activity.description,
        location=activity.location,
        event_date=activity.event_date,
        category=activity.category,
        creator_id=creator_id,
        creator_name=creator_name,
        average_rating=average,
        rating_count=rating_count,
    )
