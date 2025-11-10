from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.future import select
from transliterate import translit
from deep_translator import GoogleTranslator
from datetime import datetime
from typing import List

from src.db.database import get_db
from src.schemas.pet_schemas import PetDetailsResponse
from src.schemas.vaccination_schemas import VaccinationResponse
from src.db.models import Pets, Identifiers, Users, Vaccinations

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

    formatted_update_time = datetime.now().strftime('%d.%m.%Y %H:%M')

    response_data = {
        "passport_number": format_value(passport.passport_number if passport else None),
        "img_url": format_value(pet.img_url),
        "pet_name": pet.pet_name,
        "pet_name_latin": pet_name_latin,
        "date_of_birth": pet.date_of_birth.strftime('%d.%m.%Y'),
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
        "identifier_date": format_value(identifier.date.strftime('%d.%m.%Y') if identifier and identifier.date else None),
        "identifier_type_ua": format_value(identifier.identifier_type if identifier else None),
        "identifier_type_en": format_value(identifier_type_en),
        "update_datetime": formatted_update_time,
    }

    return PetDetailsResponse(**response_data)


@router.get("/{pet_id}/vaccinations", response_model=List[VaccinationResponse])
async def get_pet_vaccinations(pet_id: int, db: Session = Depends(get_db)):
    pet_exists = db.query(Pets).filter(Pets.pet_id == pet_id).first()
    if not pet_exists:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pet with id {pet_id} not found"
        )

    query = (
        select(Vaccinations)
        .where(Vaccinations.pet_id == pet_id)
        .options(
            joinedload(Vaccinations.organization),
            joinedload(Vaccinations.pet).joinedload(Pets.passport)
        )
        .order_by(Vaccinations.vaccination_date.desc())
    )

    result = db.execute(query)
    vaccinations = result.scalars().all()

    response_list = []
    formatted_update_time = datetime.now().strftime('%d.%m.%Y %H:%M')

    for vac in vaccinations:
        item = {
            "passport_number": format_value(vac.pet.passport.passport_number if vac.pet and vac.pet.passport else None),
            "update_datetime": formatted_update_time,
            "drug_name": format_value(vac.drug_name),
            "series_number": format_value(vac.series_number),
            "vaccination_date": format_value(vac.vaccination_date.strftime('%d.%m.%Y') if vac.vaccination_date else None),
            "valid_until": format_value(vac.valid_until.strftime('%d.%m.%Y') if vac.valid_until else None),
            "organization_name": format_value(vac.organization.organization_name if vac.organization else None)
        }
        response_list.append(item)

    return response_list