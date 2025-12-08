import secrets
from dotenv import load_dotenv
from datetime import datetime,  timezone
from fastapi import APIRouter, Depends
from typing import Annotated
from sqlalchemy.orm import Session
from src.db.database import get_db
from src.db.models import Users
from src.utils.email_utils import send_reset_email
from src.password.schemas import ForgotPasswordPayload
router = APIRouter(tags=['Forgot password 🤔'])

load_dotenv()

FRONTEND_URL =  "https://e-pet-seven.vercel.app"

db_dependency = Annotated[Session, Depends(get_db)]


@router.post("/forgot-password/")
async def forgot_password_route(payload: ForgotPasswordPayload, db: db_dependency):
    user = db.query(Users).filter(Users.email == payload.email).first()
    
    if user:
        reset_token = secrets.token_urlsafe(32)
        token_created_at = datetime.now(timezone.utc)
        
        user.reset_token = reset_token
        user.reset_token_created_at = token_created_at
        db.commit()

        reset_link = f"{FRONTEND_URL}/reset-password?token={reset_token}"
        
        await send_reset_email(
            to_email=user.email,
            reset_link=reset_link
        )

    return {"msg": "Якщо електронна адреса існує, посилання для скидання паролю було надіслано на пошту."}