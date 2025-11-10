from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.future import select
from transliterate import translit
from deep_translator import GoogleTranslator
from datetime import datetime

from src.db.database import get_db
from src.schemas.pet_schemas import PetDetailsResponse
from src.db.models import Pets, Identifiers, Users

router = APIRouter(prefix="/pets", tags=["Pets"])

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

@router.get("/{pet_id}", response_model=PetDetailsResponse)
async def get_pet_details(pet_id: int, db: Session = Depends(get_db)):
    query = (
        select(Pets)
        .where(Pets.pet_id == pet_id)
        .options(
            joinedload(Pets.passport),
            joinedload(Pets.owner),
            joinedload(Pets.organization),
            joinedload(Pets.identifiers)
        )
    )

    result = db.execute(query)
    pet = result.unique().scalar_one_or_none()

    if not pet:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pet with id {pet_id} not found"
        )

    passport = pet.passport
    owner = pet.owner
    organization = pet.organization
    identifier = pet.identifiers[0] if pet.identifiers else None

    pet_name_latin = translit(pet.pet_name, 'uk', reversed=True)

    gender_ua = pet.gender
    gender_en = ""
    if gender_ua.upper() == 'Ж':
        gender_en = 'F'
    elif gender_ua.upper() == 'Ч':
        gender_en = 'M'
    else:
        gender_en = translate_text(gender_ua)

    breed_en = translate_text(pet.breed)
    color_en = translate_text(pet.color)
    species_en = translate_text(pet.species)
    identifier_type_en = translate_text(identifier.identifier_type if identifier else None)

    formatted_update_time = datetime.now().strftime('%d/%m/%Y %H:%M')

    response_data = {
        "passport_number": format_value(passport.passport_number if passport else None),
        "img_url": format_value(pet.img_url),
        "pet_name": pet.pet_name,
        "pet_name_latin": pet_name_latin,
        "date_of_birth": pet.date_of_birth.strftime('%d/%m/%Y'),
        "breed_ua": format_value(pet.breed),
        "breed_en": format_value(breed_en),
        "gender_ua": format_value(gender_ua),
        "gender_en": format_value(gender_en),
        "color_ua": format_value(pet.color),
        "color_en": format_value(color_en),
        "species_ua": format_value(pet.species),
        "species_en": format_value(species_en),
        "owner_passport_number": format_value(owner.passport_number if owner else None),
        "organization_id": format_value(organization.organization_id if organization else None),
        "identifier_number": format_value(identifier.identifier_number if identifier else None),
        "identifier_date": format_value(identifier.date.strftime('%d/%m/%Y') if identifier and identifier.date else None),
        "identifier_type_ua": format_value(identifier.identifier_type if identifier else None),
        "identifier_type_en": format_value(identifier_type_en),
        "update_datetime": formatted_update_time,
    }

    return PetDetailsResponse(**response_data)