from typing import Annotated
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from src.db.database import get_db
from src.db.models import Organizations, Users
from src.schemas.token_schemas import TokenResponse
from src.api.core import create_access_token, bcrypt_context



router = APIRouter(tags=['Login 🔐'])

db_dependency = Annotated[Session, Depends(get_db)]


@router.post('/login/', response_model=TokenResponse)
async def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: db_dependency):
    
    org = db.query(Organizations).filter(Organizations.email == form_data.username).first()
    if org:
        user_model = org
        name = org.organization_name
        user_id = org.organization_id
    else:
        user = db.query(Users).filter(Users.email == form_data.username).first()
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Користувача не знайдено")
        user_model = user
        name = user.first_name 
        user_id = user.user_id

    if not bcrypt_context.verify(form_data.password, user_model.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Неправильний пароль")

    token = create_access_token(
        subject=user_model.email,
        id=user_id,
        expires_delta=timedelta(minutes=30),
        
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "user_name": name
    }