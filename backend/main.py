from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
from app.database import engine, Base
from app.models import User, Chat, Message
from app.routes import router
from app.config import ALLOWED_ORIGINS

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create tables
try:
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created successfully")
except Exception as e:
    logger.error(f"Error creating database tables: {e}")

app = FastAPI(
    title="AI Chat API",
    description="Backend API for AI Chat Application",
    version="1.0.0"
)

# Define root and health endpoints first (before middleware)
@app.get("/")
async def root():
    return {
        "message": "AI Chat API is running",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "chats": {
                "list": "GET /api/chats",
                "create": "POST /api/chats",
                "get": "GET /api/chats/{chat_id}",
                "delete": "DELETE /api/chats/{chat_id}",
                "rename": "PUT /api/chats/{chat_id}"
            },
            "messages": {
                "list": "GET /api/chats/{chat_id}/messages",
                "send": "POST /api/chats/{chat_id}/messages"
            }
        }
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
