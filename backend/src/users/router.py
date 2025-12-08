from datetime import timedelta
from typing import Annotated, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select, or_
from datetime import datetime
from deep_translator import GoogleTranslator
from sqlalchemy.testing.pickleable import User

from src.schemas.token_schemas import TokenResponse
from src.db.database import get_db
from src.db.models import Users
from src.api.core import create_access_token, bcrypt_context, get_current_user
from src.db.models import Pets
from src.users.schemas import  UserRegistrationRequest, UserReadPersonalInfo, UserPetItem, UpdateProfileRequest
from src.users.service import register_user_service, get_my_personal_info_service, get_all_my_pets_service, update_my_profile_service

router = APIRouter(tags=['Users 🧑‍🦱'], prefix="/users")

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]


@router.get("/me", response_model=UserReadPersonalInfo, status_code=200)
async def get_my_personal_info_route(
        db: db_dependency,
        current_user: user_dependency
):
    return get_my_personal_info_service(db=db, user_id=current_user.get('user_id'))


@router.get("/me/pets", response_model=List[UserPetItem])
async def get_all_my_pets_route(db: db_dependency, user: user_dependency):
    return get_all_my_pets_service(db=db, user_id=user.get('user_id'))


@router.post('/register/', status_code=status.HTTP_201_CREATED, response_model=TokenResponse)
async def register_user_route(db: db_dependency, create_user_request: UserRegistrationRequest):
    existing_user = db.query(Users).filter(or_(Users.email == create_user_request.email, Users.passport_number == create_user_request.passport_number)).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Не вдалося створити обліковий запис. Спробуйте пізніше або використовуйте іншу електронну адресу.")
    return  register_user_service(db=db, create_user_request=create_user_request)


@router.put("/me/update-profile", status_code=200)
async def update_my_profile_route(
        updated_data: UpdateProfileRequest,
        db: db_dependency,
        current_user: user_dependency
):
    return update_my_profile_service(db=db, user_id=current_user.get('user_id'), updated_data = updated_data)
