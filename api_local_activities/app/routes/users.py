from __future__ import annotations

from fastapi import APIRouter, HTTPException, status

from app.models import UserDocument
from app.schemas import UserRequest, UserResponse


router = APIRouter(prefix="/api/users", tags=["users"])


@router.get("", response_model=list[UserResponse])
async def get_users():
    users = await UserDocument.find_all().to_list()
    users.sort(key=lambda item: item.name.lower())
    return [UserResponse(id=str(item.id), name=item.name, email=item.email) for item in users]


@router.post("", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(payload: UserRequest):
    normalized_email = payload.email.lower().strip()
    existing = await UserDocument.find_one(UserDocument.email_normalized == normalized_email)
    if existing:
        raise HTTPException(
            status_code=409,
            detail={"message": "A user with that email already exists."},
        )

    user = UserDocument(
        name=payload.name,
        email=normalized_email,
        email_normalized=normalized_email,
        password=payload.password,
    )
    await user.insert()
    return UserResponse(id=str(user.id), name=user.name, email=user.email)
