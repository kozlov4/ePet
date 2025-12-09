from fastapi import APIRouter, Depends, HTTPException
from src.db.models import Users, Organizations
from datetime import datetime, timedelta, timezone
from src.db.database import get_db
from typing import Annotated
from sqlalchemy.orm import Session
from src.authentication.service import  bcrypt_context
from starlette import status
from src.password.schemas import ResetPasswordPayload

router = APIRouter(tags=['Reset password 🔄'])
db_dependency = Annotated[Session, Depends(get_db)]


@router.post("/reset-password/")
async def reset_password_route(payload: ResetPasswordPayload, db: db_dependency):
    account = db.query(Users).filter(Users.reset_token == payload.token).first()

    if not account:
        account = db.query(Organizations).filter(Organizations.reset_token == payload.token).first()

    if not account:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Недійсний токен."
        )

    now = datetime.now(timezone.utc)

    created_at = account.reset_token_created_at
    if created_at.tzinfo is None:
        created_at = created_at.replace(tzinfo=timezone.utc)

    token_age = now - created_at

    if token_age > timedelta(hours=1):
        account.reset_token = None
        account.reset_token_created_at = None
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Токен прострочений."
        )

    account.password = bcrypt_context.hash(payload.new_password)

    account.reset_token = None
    account.reset_token_created_at = None

    db.commit()

    return {"msg": "Пароль успішно змінено."}

