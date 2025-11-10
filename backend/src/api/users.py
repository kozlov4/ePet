from datetime import  timedelta
from typing import Annotated, List
from dotenv import load_dotenv

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select
from datetime import datetime
from deep_translator import GoogleTranslator

from src.schemas.user_schemas import UserCreateRequest, UserPetItem
from src.schemas.token_schemas import TokenResponse
from src.db.database import get_db
from src.db.models import Users
from src.api.core import create_access_token, bcrypt_context, get_current_user
from src.db.models import Pets


load_dotenv()

# --- Налаштування ---

router = APIRouter(tags=['Users 🧑‍🦱'], prefix="/users")

db_dependency = Annotated[Session, Depends(get_db)]



# --- Реєстрація ---

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

    return {
        "access_token": token, 
        "token_type": "bearer", 
        "user_name": create_user_model.first_name
    }



user_dependency = Annotated[dict, Depends(get_current_user)]

def format_value(value, default="—"):
    if value is None or value == "":
        return default
    return str(value)


def translate_text(text_to_translate: str) -> str:
    if not text_to_translate:
        return ""
    try:
        return GoogleTranslator(source='auto', target='en').translate(text_to_translate)
    except Exception:
        return text_to_translate


@router.get("/me/pets", response_model=List[UserPetItem])
async def get_my_pets(db: db_dependency, user: user_dependency):
    user_id = user.get('user_id')
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials"
        )

    query = (
        select(Pets)
        .where(Pets.user_id == user_id)
        .options(joinedload(Pets.passport))
        .order_by(Pets.pet_name)
    )

    result = db.execute(query)
    user_pets = result.scalars().all()

    pet_items = []
    formatted_update_time = datetime.now().strftime('%d.%m.%Y %H:%M')

    for pet in user_pets:
        pet_name_en = translate_text(pet.pet_name)
        item = {
            "pet_id": str(pet.pet_id),
            "passport_number": format_value(pet.passport.passport_number if pet.passport else None),
            "pet_name_ua": format_value(pet.pet_name),
            "pet_name_en": format_value(pet_name_en),
            "date_of_birth": format_value(pet.date_of_birth.strftime('%d.%m.%Y') if pet.date_of_birth else None),
            "update_datetime": formatted_update_time
        }
        pet_items.append(item)

    return pet_items