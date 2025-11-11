from random import random
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.future import select
from deep_translator import GoogleTranslator
from datetime import date, datetime

from src.db.database import get_db
from src.schemas.vaccination_schemas import VaccinationsListResponse
from src.db.models import Pets, Vaccinations, Organizations, Passports, Identifiers, Users
from typing import Annotated
from src.api.core import  get_current_user
from src.api.organization import  get_current_organization, get_current_organization_optional
from src.schemas.pet_schemas import AnimaForCnap, AnimaForlLintel, AnimalForVeterinary, AnimalForUser, AddPetRequest, AddIdentifierRequest, IdentifierResponse


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
    organization_user: Annotated[Organizations, Depends(get_current_organization_optional)],
    user: user_dependency
):
    pet = db.query(Pets).filter(Pets.pet_id == pet_id).first()

    if pet is None:
        raise HTTPException(status_code=404, detail="Тваринку не знайдено")

    passport = pet.passport
    organization = passport.organization if passport else None
    identifier = pet.identifiers[0] if pet.identifiers else None
    translation = GoogleTranslator(source='auto', target='en')

    org_type = organization_user.organization_type if organization_user else None
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
            organization_name=organization.organization_name if organization else "—",
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
            organization_name=organization.organization_name if organization else "—",
            date=identifier.date if identifier else None,
            identifier_type=identifier.identifier_type if identifier else "—",
            identifier_type_en=translation.translate(identifier.identifier_type) if identifier else "—",
            identifier_number=identifier.identifier_number if identifier else "—",
            owner_passport_number=pet.owner.passport_number if pet.owner else "—",
        )

    elif (org_type == None and user_id != None):
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
            organization_name=organization.organization_name if organization else "—",
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


@router.post("/pets", status_code=201)
async def add_pet(
    pet_data: AddPetRequest,
    db: db_dependency,
    organization_user: Annotated[Organizations, Depends(get_current_organization)]
):
    org_type = organization_user.organization_type


    if org_type not in ["Притулок", "ЦНАП"]:
        raise HTTPException(status_code=403, detail="Додавати тварин можуть лише Притулок або ЦНАП")

    user_id = None
    if org_type == "ЦНАП":
        if not pet_data.owner_passport_number:
            raise HTTPException(status_code=400, detail="Потрібно вказати номер паспорта власника")
        user = db.query(Users).filter(Users.passport_number == pet_data.owner_passport_number).first()
        if not user:
            raise HTTPException(status_code=404, detail="Користувача з таким паспортом не знайдено")
        user_id = user.user_id

    new_pet = Pets(
        img_url=pet_data.img_url,
        pet_name=pet_data.pet_name,
        species=pet_data.species,
        breed=pet_data.breed,
        gender=pet_data.gender,
        date_of_birth=pet_data.date_of_birth,
        color=pet_data.color,
        organization_id=organization_user.organization_id,
        user_id=user_id
    )

    db.add(new_pet)
    db.commit()
    db.refresh(new_pet)
    
    if org_type == "ЦНАП":
        passport_number = generate_passport_number(new_pet.pet_id)
        new_passport = Passports(
            passport_number=passport_number,
            pet_id=new_pet.pet_id
        )
        db.add(new_passport)
        db.commit() 

    return {
        "message": "Тварину успішно додано",
        "pet_id": new_pet.pet_id,
        "organization": organization_user.organization_name
    }
    
    
@router.post("/{pet_id}/identifier", response_model=IdentifierResponse)
async def add_pet_identifier(
    pet_id: int,
    request: AddIdentifierRequest,
    db: Annotated[Session, Depends(get_db)],
    organization_user: Annotated[Organizations, Depends(get_current_organization)]
):

    if organization_user.organization_type != "Ветклініка":
        raise HTTPException(status_code=403, detail="Додавати ідентифікатори можуть лише ветклініки")

    pet = db.query(Pets).filter(Pets.pet_id == pet_id).first()
    if not pet:
        raise HTTPException(status_code=404, detail="Тварина не знайдена")

    if not request.identifier_number or not request.identifier_type:
        raise HTTPException(status_code=400, detail="Необхідно вказати номер та тип ідентифікатора")

    new_identifier = Identifiers(
        identifier_number=request.identifier_number,
        identifier_type=request.identifier_type,
        identifier_place=request.identifier_place,
        date=date.today(),
        organization_id=organization_user.organization_id,
        pet_id=pet.pet_id
    )

    db.add(new_identifier)
    db.commit()
    db.refresh(new_identifier)

    passport = db.query(Passports).filter(Passports.pet_id == pet.pet_id).first()

    return {
        "pet_id": pet.pet_id,
        "identifier_number": new_identifier.identifier_number,
        "identifier_type": new_identifier.identifier_type,
        "identifier_place": new_identifier.identifier_place,
        "date": new_identifier.date,
        "passport_number": passport.passport_number if passport else None
    }
    
    