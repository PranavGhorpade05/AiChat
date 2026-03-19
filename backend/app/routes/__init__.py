"""
Routes module: Import and register all route routers
"""
from fastapi import APIRouter
from app.routes import chats, messages

# Create a main router to combine all sub-routers
router = APIRouter()

# Include the chat routes
router.include_router(chats.router)

# Include the message routes
router.include_router(messages.router)

# Export router for use in main.py
__all__ = ["router"]