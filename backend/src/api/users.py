from fastapi import APIRouter, Depends, HTTPException
from typing import Annotated
from datetime import timedelta
from src.schemas.user import UserResponse, UserCreateRequest
from src.schemas.token import TokenResponse
from sqlalchemy.orm import Session
from starlette import status
from src.db.database import get_db
from src.db.models import Users
from passlib.context import CryptContext
from src.api.core import create_access_token, bcrypt_context

router = APIRouter(tags=['Users 🧑‍🦱'], prefix="/users")

db_dependency = Annotated[Session, Depends(get_db)]


@router.post('/register/', status_code=status.HTTP_201_CREATED, response_model=TokenResponse)
async def create_user(db: db_dependency, create_user_request: UserCreateRequest):
    existing_user = db.query(Users).filter(Users.email == create_user_request.email).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already in use.")

    create_user_model = Users(
        last_name=create_user_request.last_name,
        first_name=create_user_request.first_name,
        patronymic=create_user_request.patronymic,
        passport_number=create_user_request.passport_number,
        
        city=create_user_request.city,
        street=create_user_request.street,
        house_number=create_user_request.house_number,
        
        postal_index=create_user_request.postal_index,
        email=create_user_request.email,
        password=bcrypt_context.hash(create_user_request.password)
    )
    
    db.add(create_user_model)
    db.commit()
    db.refresh(create_user_model)


    token = create_access_token(
        subject=create_user_model.email,
        id=create_user_model.user_id,
        expires_delta=timedelta(minutes=30)
    )

    return {"access_token": token, "token_type": "bearer"} 
