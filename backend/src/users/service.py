from datetime import timedelta
from typing import Annotated, List
from dotenv import load_dotenv

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select
from datetime import datetime
from deep_translator import GoogleTranslator

from src.schemas.user_schemas import  UserPetItem, UserResponse, UpdateProfileRequest
from src.schemas.token_schemas import TokenResponse
from src.db.database import get_db
from src.db.models import Users
from src.api.core import create_access_token, bcrypt_context, get_current_user
from src.db.models import Pets
from src.users.schemas import  UserRegistrationRequest



db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]




def register_user_service(db: Session, create_user_request: UserRegistrationRequest):
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

    return {
        "access_token": token,
        "token_type": "bearer",
        "user_name": create_user_model.first_name
    }
