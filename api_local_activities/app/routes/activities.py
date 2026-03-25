from __future__ import annotations

from fastapi import APIRouter, Query, Response, status

from app.helpers import (
    activity_not_found,
    as_object_id,
    build_activity_response,
    user_not_found,
)
from app.models import ActivityDocument, UserDocument
from app.schemas import ActivityRequest, ActivityResponse


router = APIRouter(prefix="/api/activities", tags=["activities"])


@router.get("", response_model=list[ActivityResponse])
async def get_activities(category: str | None = Query(default=None)):
    if category and category.strip():
        activities = await ActivityDocument.find(
            {"category": {"$regex": f"^{category.strip()}$", "$options": "i"}}
        ).to_list()
    else:
        activities = await ActivityDocument.find_all().to_list()

    activities.sort(key=lambda item: item.event_date)
    return [await build_activity_response(item) for item in activities]


@router.get("/top-rated", response_model=list[ActivityResponse])
async def get_top_rated_activities():
    activities = await ActivityDocument.find_all().to_list()
    data = [await build_activity_response(item) for item in activities]
    data.sort(key=lambda item: (-item.average_rating, -item.rating_count, item.event_date))
    return data[:5]


@router.get("/{activity_id}", response_model=ActivityResponse)
async def get_activity(activity_id: str):
    object_id = as_object_id(activity_id)
    if object_id is None:
        raise activity_not_found(activity_id)
    activity = await ActivityDocument.get(object_id)
    if activity is None:
        raise activity_not_found(activity_id)
    return await build_activity_response(activity)


@router.post("", response_model=ActivityResponse, status_code=status.HTTP_201_CREATED)
async def create_activity(payload: ActivityRequest):
    creator_object_id = as_object_id(payload.creator_id)
    if payload.creator_id is not None and creator_object_id is None:
        raise user_not_found(payload.creator_id)
    if creator_object_id:
        creator = await UserDocument.get(creator_object_id)
        if creator is None:
            raise user_not_found(payload.creator_id or "")

    activity = ActivityDocument(
        name=payload.name,
        description=payload.description,
        location=payload.location,
        event_date=payload.event_date,
        category=payload.category,
        creator_id=creator_object_id,
    )
    await activity.insert()
    return await build_activity_response(activity)


@router.put("/{activity_id}", response_model=ActivityResponse)
async def update_activity(activity_id: str, payload: ActivityRequest):
    object_id = as_object_id(activity_id)
    if object_id is None:
        raise activity_not_found(activity_id)
    activity = await ActivityDocument.get(object_id)
    if activity is None:
        raise activity_not_found(activity_id)

    creator_object_id = as_object_id(payload.creator_id)
    if payload.creator_id is not None and creator_object_id is None:
        raise user_not_found(payload.creator_id)
    if creator_object_id:
        creator = await UserDocument.get(creator_object_id)
        if creator is None:
            raise user_not_found(payload.creator_id or "")

    activity.name = payload.name
    activity.description = payload.description
    activity.location = payload.location
    activity.event_date = payload.event_date
    activity.category = payload.category
    activity.creator_id = creator_object_id
    await activity.save()

    return await build_activity_response(activity)


@router.delete("/{activity_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_activity(activity_id: str):
    object_id = as_object_id(activity_id)
    if object_id is None:
        raise activity_not_found(activity_id)
    activity = await ActivityDocument.get(object_id)
    if activity is None:
        raise activity_not_found(activity_id)
    await activity.delete()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
