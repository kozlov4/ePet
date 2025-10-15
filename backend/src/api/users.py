from fastapi import APIRouter, Depends, HTTPException
from typing import Annotated
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from jose import jwt, JWTError
from src.schemas.user import UserResponse, UserCreateRequest
from sqlalchemy.orm import Session
from starlette import status
from src.db.database import get_db
from src.db.models import Users
from passlib.context import CryptContext

router = APIRouter()

db_dependency = Annotated[Session, Depends(get_db)]
bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')


@router.post('/auth', status_code=status.HTTP_201_CREATED, response_model=UserResponse)
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
    return create_user_model