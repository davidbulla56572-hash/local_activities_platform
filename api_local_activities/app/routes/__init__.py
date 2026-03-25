from .activities import router as activities_router
from .ratings import router as ratings_router
from .users import router as users_router

__all__ = ["activities_router", "ratings_router", "users_router"]
