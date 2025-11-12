from random import random
from enum import Enum
from fastapi import APIRouter, Depends, HTTPException, status,  UploadFile, Form
from sqlalchemy.orm import Session, joinedload
from typing import Union
from sqlalchemy.future import select
from deep_translator import GoogleTranslator
from datetime import datetime, date
from src.api.image import upload_image
from src.db.database import get_db
from src.schemas.vaccination_schemas import VaccinationsListResponse
from src.db.models import Pets, Vaccinations, Organizations, Cnap, Passports, Identifiers, Users
from typing import Annotated
from src.api.core import  get_current_user
from src.api.organization import  get_current_organization_optional, get_current_org_or_cnap,get_current_organization, get_current_cnap_optional
from src.schemas.pet_schemas import AnimaForCnap, AnimaForlLintel, AnimalForVeterinary, AnimalForUser


router = APIRouter(prefix="/pets", tags=["Pets 🐶"])
db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

def format_value(value, default="—"):
    if value is None or value == "":
        return default
    return str(value)

def check_gender(gender):
    if gender == "Ж":
        return "F"
    elif gender == "Ч":
        return "M"

@router.get("/{pet_id}")
async def get_pet_info(
    pet_id: int,
    db: db_dependency,
    organization_user: Annotated[Union[Organizations, Cnap, None], Depends(get_current_org_or_cnap)],
    user: user_dependency
):
    pet = db.query(Pets).filter(Pets.pet_id == pet_id).first()
    org_id = pet.organization_id
    if pet is None:
        raise HTTPException(status_code=404, detail="Тваринку не знайдено")

    passport = pet.passport
    organization = passport.organization if passport else None
    identifier = pet.identifiers[0] if pet.identifiers else None
    translation = GoogleTranslator(source='auto', target='en')

    if isinstance(organization_user, Organizations):
        org_type = organization_user.organization_type
    elif isinstance(organization_user, Cnap):
        org_type = "ЦНАП"
    else:
        org_type = None


    user_id = user.get('user_id')

    if org_type == "Притулок":
        return AnimaForlLintel(
            pet_id=pet.pet_id,
            passport_number=passport.passport_number if passport else "—",
            img_url=pet.img_url,
            pet_name=pet.pet_name,
            pet_name_en=translation.translate(pet.pet_name),
            date_of_birth=pet.date_of_birth,
            breed=pet.breed,
            breed_en=translation.translate(pet.breed),
            gender=pet.gender,
            gender_en=translation.translate(check_gender(pet.gender)),
            color=pet.color,
            color_en=translation.translate(pet.color),
            species=pet.species,
            species_en=translation.translate(pet.species)
        )

    elif org_type == "Ветклініка":
        return AnimalForVeterinary(
            pet_id=pet.pet_id,
            passport_number=passport.passport_number if passport else "—",
            img_url=pet.img_url,
            pet_name=pet.pet_name,
            pet_name_en=translation.translate(pet.pet_name),
            date_of_birth=pet.date_of_birth,
            breed=pet.breed,
            breed_en=translation.translate(pet.breed),
            gender=pet.gender,
            gender_en=translation.translate(check_gender(pet.gender)),
            color=pet.color,
            color_en=translation.translate(pet.color),
            species=pet.species,
            species_en=translation.translate(pet.species),
            organization_id=org_id,
            date=identifier.date if identifier else None,
            identifier_type=identifier.identifier_type if identifier else "—",
            identifier_type_en=translation.translate(identifier.identifier_type) if identifier else "—",
            identifier_number=identifier.identifier_number if identifier else "—",
            owner_passport_number=pet.owner.passport_number if pet.owner else "—",
        )

    elif org_type == "ЦНАП":
        return AnimaForCnap(
            pet_id=pet.pet_id,
            passport_number=passport.passport_number if passport else "—",
            img_url=pet.img_url,
            pet_name=pet.pet_name,
            pet_name_en=translation.translate(pet.pet_name),
            date_of_birth=pet.date_of_birth,
            breed=pet.breed,
            breed_en=translation.translate(pet.breed),
            gender=pet.gender,
            gender_en=translation.translate(check_gender(pet.gender)),
            color=pet.color,
            color_en=translation.translate(pet.color),
            species=pet.species,
            species_en=translation.translate(pet.species),
            organization_id=org_id,  
            date=identifier.date if identifier else None,
            identifier_type=identifier.identifier_type if identifier else "—",
            identifier_type_en=translation.translate(identifier.identifier_type) if identifier else "—",
            identifier_number=identifier.identifier_number if identifier else "—",
            owner_passport_number=pet.owner.passport_number if pet.owner else "—",
        )

    elif org_type is None and user_id is not None:
        return AnimalForUser(
            pet_id=pet.pet_id,
            passport_number=passport.passport_number if passport else "—",
            img_url=pet.img_url,
            pet_name=pet.pet_name,
            pet_name_en=translation.translate(pet.pet_name),
            date_of_birth=pet.date_of_birth,
            breed=pet.breed,
            breed_en=translation.translate(pet.breed),
            gender=pet.gender,
            gender_en=translation.translate(check_gender(pet.gender)),
            color=pet.color,
            color_en=translation.translate(pet.color),
            species=pet.species,
            species_en=translation.translate(pet.species),
            organization_id=org_id,
            date=identifier.date if identifier else None,
            identifier_type=identifier.identifier_type if identifier else "—",
            identifier_type_en=translation.translate(identifier.identifier_type) if identifier else "—",
            identifier_number=identifier.identifier_number if identifier else "—",
            owner_passport_number=pet.owner.passport_number if pet.owner else "—",
            update_datetime=datetime.now().strftime('%d.%m.%Y %H:%M')
        )

    else:
        raise HTTPException(status_code=403, detail="Немає доступу")



@router.get("/{pet_id}/vaccinations", response_model=VaccinationsListResponse)
async def get_pet_vaccinations(pet_id: int, db: Session = Depends(get_db)):
    pet = db.query(Pets).options(joinedload(Pets.passport)).filter(Pets.pet_id == pet_id).first()
    if not pet:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pet with id {pet_id} not found"
        )

    query = (
        select(Vaccinations)
        .where(Vaccinations.pet_id == pet_id)
        .options(joinedload(Vaccinations.organization))
        .order_by(Vaccinations.vaccination_date.desc())
    )

    result = db.execute(query)
    vaccinations_from_db = result.scalars().all()

    vaccination_items = []
    for vac in vaccinations_from_db:
        item = {
            "drug_name": format_value(vac.drug_name),
            "series_number": format_value(vac.series_number),
            "vaccination_date": format_value(vac.vaccination_date.strftime('%d.%m.%Y') if vac.vaccination_date else None),
            "valid_until": format_value(vac.valid_until.strftime('%d.%m.%Y') if vac.valid_until else None),
            "organization_name": format_value(vac.organization.organization_name if vac.organization else None)
        }
        vaccination_items.append(item)

    return {
        "passport_number": format_value(pet.passport.passport_number if pet.passport else None),
        "update_datetime": datetime.now().strftime('%d.%m.%Y %H:%M'),
        "vaccinations": vaccination_items
    }


def generate_passport_number(db) -> str:
    while True:
        number = random.randint(1000, 999999)
        passport_number = f"UA-AA-{number:06d}"
        exists = db.query(Pets).filter(Pets.passport_number == passport_number).first()
        if not exists:
            return passport_number


class GenderEnum(str, Enum):
    male = "Ч"
    female = "Ж"

@router.post("/pets", status_code=201)
async def add_pet(
    file: UploadFile,
    pet_name: str = Form(..., min_length=3, max_length=100),
    gender: GenderEnum = Form(...),
    breed: str = Form(..., min_length=3, max_length=50),
    species: str = Form(..., min_length=3, max_length=50),
    color: str = Form(..., min_length=3, max_length=30),
    identifier_type: str = Form(..., min_length=3, max_length=50),
    identifier_number: str = Form(..., min_length=3, max_length=50),
    chip_date: date = Form(...),
    owner_passport_number: str = Form(..., min_length=3, max_length=20),
    db: Session = Depends(get_db),
    cnap: Annotated[Union[Cnap, None], Depends(get_current_cnap_optional)] = None,
):
    if cnap is None:
        raise HTTPException(status_code=403, detail="Додавати тварин можуть лише ЦНАП")

    user = db.query(Users).filter(Users.passport_number == owner_passport_number).first()
    if not user:
        raise HTTPException(status_code=404, detail="Користувача з таким паспортом не знайдено")

    img_url: str = upload_image(file)  

    new_pet = Pets(
        img_url=img_url,
        pet_name=pet_name,
        species=species,
        breed=breed,
        gender=gender.value, 
        date_of_birth=datetime.utcnow(),
        color=color,
        organization_id=cnap.cnap_id,
        user_id=user.user_id,
        sterilization=False
    )
    db.add(new_pet)
    db.commit()
    db.refresh(new_pet)

    existing_identifier = db.query(Identifiers).filter(
        Identifiers.identifier_number == identifier_number
    ).first()
    if existing_identifier:
        raise HTTPException(
            status_code=400,
            detail=f"Ідентифікатор з номером '{identifier_number}' вже існує"
        )

    identifier = Identifiers(
        identifier_number=identifier_number,
        identifier_type=identifier_type,
        date=chip_date,
        cnap_id=cnap.cnap_id,
        pet_id=new_pet.pet_id
    )
    db.add(identifier)
    db.commit()

    return {
        "message": "Тварину успішно додано",
        "pet_id": new_pet.pet_id,
        "img_url": img_url,
        "chip": {
            "identifier_number": identifier.identifier_number,
            "identifier_type": identifier.identifier_type,
            "chip_date": chip_date.isoformat()
        }
    }