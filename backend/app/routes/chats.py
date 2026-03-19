from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import uuid

from app.database import get_db
from app.models import User, Chat, Message
from app.schemas import ChatSchema, ChatCreateSchema, ChatRenameSchema, MessageSchema

router = APIRouter(prefix="/api/chats", tags=["chats"])


# Create Chat
@router.post("")
async def create_chat(
    request: ChatCreateSchema,
    x_user_email: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    try:
        if not x_user_email:
            raise HTTPException(status_code=401, detail="User email required")

        user = db.query(User).filter(User.email == x_user_email).first()
        if not user:
            user = User(
                id=f"user_{uuid.uuid4().hex[:12]}",
                email=x_user_email,
                name=x_user_email.split("@")[0]
            )
            db.add(user)
            db.commit()

        chat = Chat(
            id=f"chat_{uuid.uuid4().hex[:12]}",
            user_id=user.id,
            title=request.title or "New Chat"
        )
        db.add(chat)
        db.commit()

        return ChatSchema(
            id=chat.id,
            title=chat.title,
            createdAt=chat.created_at,
            messages=[]
        )

    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


# Get All Chats
@router.get("", response_model=List[ChatSchema])
async def get_chats(
    x_user_email: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    try:
        user = db.query(User).filter(User.email == x_user_email).first()
        if not user:
            return []

        chats = db.query(Chat).filter(Chat.user_id == user.id).all()

        return [
            ChatSchema(
                id=chat.id,
                title=chat.title,
                createdAt=chat.created_at,
                messages=[
                    MessageSchema(
                        id=msg.id,
                        role=msg.role,
                        content=msg.content,
                        timestamp=msg.created_at
                    )
                    for msg in db.query(Message).filter(Message.chat_id == chat.id).all()
                ]
            )
            for chat in chats
        ]

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Get Single Chat
@router.get("/{chat_id}", response_model=ChatSchema)
async def get_chat(chat_id: str, db: Session = Depends(get_db)):
    try:
        chat = db.query(Chat).filter(Chat.id == chat_id).first()
        if not chat:
            raise HTTPException(status_code=404, detail="Chat not found")

        messages = db.query(Message).filter(Message.chat_id == chat_id).all()

        return ChatSchema(
            id=chat.id,
            title=chat.title,
            createdAt=chat.created_at,
            messages=[
                MessageSchema(
                    id=msg.id,
                    role=msg.role,
                    content=msg.content,
                    timestamp=msg.created_at
                )
                for msg in messages
            ]
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Delete Chat
@router.delete("/{chat_id}")
async def delete_chat(chat_id: str, db: Session = Depends(get_db)):
    try:
        chat = db.query(Chat).filter(Chat.id == chat_id).first()
        if not chat:
            raise HTTPException(status_code=404, detail="Chat not found")

        db.delete(chat)
        db.commit()

        return {"message": "Chat deleted", "chatId": chat_id}

    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


# Rename Chat
@router.put("/{chat_id}")
async def rename_chat(
    chat_id: str,
    request: ChatRenameSchema,
    db: Session = Depends(get_db)
):
    try:
        chat = db.query(Chat).filter(Chat.id == chat_id).first()
        if not chat:
            raise HTTPException(status_code=404, detail="Chat not found")

        if not request.title:
            raise HTTPException(status_code=400, detail="Title required")

        chat.title = request.title
        chat.updated_at = datetime.utcnow()
        db.commit()

        return {"message": "Chat renamed", "chatId": chat_id}

    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))