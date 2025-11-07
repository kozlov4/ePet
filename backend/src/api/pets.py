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

def translate_text(text_to_translate: str) -> str:
    if not text_to_translate:
        return ""
    try:
        return GoogleTranslator(source='auto', target='en').translate(text_to_translate)
    except Exception:
        return text_to_translate


@router.get("/full/{pet_id}", response_model=PetDetailsResponse)
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

    pet_name_latin = translit(pet.pet_name, 'ru', reversed=True)

    identifier_type_ua = None
    if pet.identifiers:
        identifier_type_ua = pet.identifiers[0].identifier_type

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
    identifier_type_en = translate_text(identifier_type_ua)

    formatted_update_time = datetime.now().strftime('%d/%m/%Y %H:%M')

    response_data = {
        "passport_number": pet.passport.passport_number if pet.passport else None,
        "pet_name": pet.pet_name,
        "pet_name_latin": pet_name_latin,
        "date_of_birth": pet.date_of_birth,
        
        "breed_ua": pet.breed,
        "breed_en": breed_en,
        
        "gender_ua": gender_ua,
        "gender_en": gender_en,
        
        "color_ua": pet.color,
        "color_en": color_en,
        
        "species_ua": pet.species,
        "species_en": species_en,
        
        "owner_passport_number": pet.owner.passport_number if pet.owner else None,
        "organization_id": pet.organization.organization_id if pet.organization else None,
        
        "identifier_number": pet.identifiers[0].identifier_number if pet.identifiers else None,
        "identifier_date": pet.identifiers[0].date if pet.identifiers else None,
        
        "identifier_type_ua": identifier_type_ua,
        "identifier_type_en": identifier_type_en,
        
        "update_datetime": formatted_update_time,
    }

    return PetDetailsResponse(**response_data)