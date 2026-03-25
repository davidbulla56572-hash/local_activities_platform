from __future__ import annotations

from contextlib import asynccontextmanager

from beanie import init_beanie
from fastapi import FastAPI
from motor.motor_asyncio import AsyncIOMotorClient

from app.config import get_settings
from app.models import ActivityDocument, RatingDocument, UserDocument
from app.seed import seed_if_empty


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = get_settings()
    client = AsyncIOMotorClient(settings.mongodb_uri)
    database = client[settings.database_name]

    await init_beanie(
        database=database,
        document_models=[UserDocument, ActivityDocument, RatingDocument],
    )
    app.state.mongo_client = client

    if settings.seed_data and settings.env.lower() != "test":
        await seed_if_empty()

    yield
    client.close()
