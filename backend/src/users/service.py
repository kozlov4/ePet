from datetime import timedelta
from typing import Annotated

from fastapi import  Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select
from datetime import datetime
from deep_translator import GoogleTranslator

from src.db.database import get_db
from src.db.models import Users
from src.api.core import create_access_token, bcrypt_context, get_current_user
from src.users.schemas import  UserRegistrationRequest, UpdateProfileRequest
from src.db.models import  Pets


db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]


def translate_text(text_to_translate: str) -> str:
    if not text_to_translate:
        return ""
    try:
        return GoogleTranslator(source='auto', target='en').translate(text_to_translate)
    except Exception:
        return text_to_translate


def format_value(value, default="—"):
    if value is None or value == "":
        return default
    return str(value)


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


def get_my_personal_info_service(db:Session, user_id:int):
    user = db.query(Users).filter(Users.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Користувача не знайдено.")

    address_str = f"{user.city}, {user.street} {user.house_number}"

    return {
        "user_id": user.user_id,
        "last_name": user.last_name,
        "first_name": user.first_name,
        "patronymic": user.patronymic,
        "passport_number": user.passport_number,
        "full_address": address_str,
        "postal_index": user.postal_index,
        "email": user.email,
    }

#TODO видалити тут перевірку на типу немає паспорта (він на продакшн буде)
def get_all_my_pets_service(db:Session, user_id:int):

    query = (
        select(Pets)
        .where(Pets.user_id == user_id)
        .options(joinedload(Pets.passport))
        .order_by(Pets.pet_name)
    )

    result = db.execute(query)
    user_pets = result.scalars().all()

    pet_items = []
    formatted_update_time = datetime.now().strftime('%d.%m.%Y')

    for pet in user_pets:
        pet_name_en = translate_text(pet.pet_name)
        item = {
            "pet_id": str(pet.pet_id),
            "img_url": str(pet.img_url),
            "passport_number": format_value(pet.passport.passport_number if pet.passport else None),
            "pet_name_ua": format_value(pet.pet_name),
            "pet_name_en": format_value(pet_name_en),
            "date_of_birth": format_value(pet.date_of_birth.strftime('%d.%m.%Y') if pet.date_of_birth else None),
            "update_datetime": formatted_update_time
        }
        pet_items.append(item)

    return pet_items


def update_my_profile_service(db: Session, user_id:int, updated_data: UpdateProfileRequest):
    user = db.query(Users).filter(Users.user_id == user_id).first()

    email_changed = False

    if updated_data.new_email and updated_data.new_email != user.email:
        existing = db.query(Users).filter(Users.email == updated_data.new_email).first()
        if existing:
            raise HTTPException(
                status_code=409,
                detail="Помилка при змінні email, спробуйте інший email"
            )
        user.email = updated_data.new_email
        email_changed = True

    if updated_data.new_password:
        if not updated_data.old_password:
            raise HTTPException(
                status_code=400,
                detail="Для зміни пароля необхідно ввести старий пароль."
            )

        if not bcrypt_context.verify(updated_data.old_password, user.password):
            raise HTTPException(
                status_code=400,
                detail="Невірний старий пароль."
            )

        if bcrypt_context.verify(updated_data.new_password, user.password):
            raise HTTPException(
                status_code=400,
                detail="Новий пароль повинен відрізнятися від старого."
            )

        user.password = bcrypt_context.hash(updated_data.new_password)

    db.commit()
    db.refresh(user)

    response = {
        "message": "Дані профілю успішно оновлено",
        "access_token": None,
        "token_type": None
    }

    if email_changed:
        token = create_access_token(
            subject=user.email,
            id=user.user_id,
            expires_delta=timedelta(minutes=30)
        )
        response["access_token"] = token
        response["token_type"] = "bearer"

    return response

