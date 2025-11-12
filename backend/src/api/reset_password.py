
from fastapi import APIRouter, Depends, HTTPException
from src.db.models import Users
from datetime import datetime, timedelta
from src.db.database import get_db
from typing import Annotated
from sqlalchemy.orm import Session
from src.api.core import  bcrypt_context
from starlette import status
from src.schemas.password_schemas import ResetPasswordPayload


router = APIRouter(tags=['Reset password 🔄'])
db_dependency = Annotated[Session, Depends(get_db)]



@router.post("/reset-password/")
async def reset_password(payload: ResetPasswordPayload, db: db_dependency):
    user = db.query(Users).filter(Users.reset_token == payload.token).first()

    token_expired = True
    if user and user.reset_token_created_at:
        token_age = datetime.utcnow() - user.reset_token_created_at
        print(token_age)
        if token_age <= timedelta(hours=1):
            token_expired = False
    if not user or token_expired:
        if user: 
            user.reset_token = None
            user.reset_token_created_at = None
            db.commit()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Недійсний або прострочений токен."
        )

    user.password = bcrypt_context.hash(payload.new_password)
    user.reset_token = None
    user.reset_token_created_at = None
    db.commit()

    return {"msg": "Пароль успішно змінено."}

