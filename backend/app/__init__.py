"""
Initialize the app package
"""
from app.database import Base, engine
from app.models import User, Chat, Message

# Create all tables
Base.metadata.create_all(bind=engine)
