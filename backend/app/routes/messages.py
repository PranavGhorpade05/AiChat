from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid

from app.database import get_db
from app.models import User, Chat, Message
from app.schemas import MessageCreateSchema, ChatResponseSchema, MessageSchema
from app.services import gemini_service

router = APIRouter(prefix="/api/chats", tags=["messages"])


# Send Message
@router.post("/{chat_id}/messages")
async def send_message(
    chat_id: str,
    request: MessageCreateSchema,
    x_user_email: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    try:
        if not x_user_email:
            raise HTTPException(status_code=401, detail="User email required")

        user = db.query(User).filter(User.email == x_user_email).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        chat = db.query(Chat).filter(Chat.id == chat_id).first()
        if not chat:
            raise HTTPException(status_code=404, detail="Chat not found")

        # Save user message
        user_message = Message(
            id=f"msg_{uuid.uuid4().hex[:12]}",
            chat_id=chat.id,
            role="user",
            content=request.message
        )
        db.add(user_message)
        db.commit()

        # Prepare history
        history = [
            {"role": msg.get("role"), "content": msg.get("content")}
            for msg in (request.history or [])
        ]

        # AI response
        ai_response = gemini_service.generate_response(request.message, history)

        # Save AI message
        ai_message = Message(
            id=f"msg_{uuid.uuid4().hex[:12]}",
            chat_id=chat.id,
            role="assistant",
            content=ai_response
        )
        db.add(ai_message)
        db.commit()

        return ChatResponseSchema(response=ai_response)

    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


# Get Messages
@router.get("/{chat_id}/messages", response_model=List[MessageSchema])
async def get_messages(
    chat_id: str,
    x_user_email: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    try:
        if not x_user_email:
            raise HTTPException(status_code=401, detail="User email required")

        chat = db.query(Chat).filter(Chat.id == chat_id).first()
        if not chat:
            raise HTTPException(status_code=404, detail="Chat not found")

        messages = db.query(Message).filter(Message.chat_id == chat_id).all()

        return [
            MessageSchema(
                id=msg.id,
                role=msg.role,
                content=msg.content,
                timestamp=msg.created_at
            )
            for msg in messages
        ]

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))