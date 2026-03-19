from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import List, Optional

class MessageSchema(BaseModel):
    id: str
    role: str
    content: str
    timestamp: datetime

    class Config:
        from_attributes = True

class ChatSchema(BaseModel):
    id: str
    title: str
    createdAt: datetime
    messages: List[MessageSchema] = []

    class Config:
        from_attributes = True

class ChatCreateSchema(BaseModel):
    title: Optional[str] = "New Chat"

class MessageCreateSchema(BaseModel):
    message: str
    history: List[dict] = []

class ChatResponseSchema(BaseModel):
    response: str

class ChatRenameSchema(BaseModel):
    title: str

class UserSchema(BaseModel):
    id: str
    email: str
    name: str

    class Config:
        from_attributes = True