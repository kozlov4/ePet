from datetime import date
from random import random
from typing import Annotated, Optional
import math
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from src.db.database import get_db
from src.db.models import Organizations, Pets, Passports, Users, Identifiers
from src.api.core import  get_current_user
from src.schemas.organization_schemas import AnimalForOrgResponse, OwnerForOrgResponse, PaginatedAnimalResponse, GetOrgInfo, AnimaForlLintel, AnimalForVeterinary, AnimaForCnap, AddPetRequest, AddIdentifierRequest, IdentifierResponse 
from deep_translator import GoogleTranslator



router = APIRouter(tags=['Organizations 🏢'], prefix="/organizations")
db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]



async def get_current_organization(user: user_dependency, db: db_dependency) -> Organizations:
    user_id = user.get('user_id')
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Не вдалося витягти ID організації з токена."
        )

    organization = db.query(Organizations).filter(
        (Organizations.organization_id == user_id) &
        (Organizations.organization_type.in_(['ЦНАП', 'Ветклініка', 'Притулок']))
    ).first()
    
    if not organization:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Доступ дозволено тільки для організацій."
        )
    return organization


@router.get('/animals/', response_model=PaginatedAnimalResponse)
async def get_animals_for_cnap(
    db: db_dependency, 
    organization_user: Annotated[Organizations, Depends(get_current_organization)],
    page: Annotated[int, Query(ge=1, description="Номер сторінки")] = 1,
    size: Annotated[int, Query(ge=1, le=100, description="Кількість записів на сторінці")] = 6,
    animal_passport_number: Optional[str] = Query(None, description="Номер паспорта тварини для пошуку")
):

    org_type = organization_user.organization_type

    base_query = db.query(Pets)


    if org_type == 'Притулок':
        base_query = base_query.filter(Pets.organization_id == organization_user.organization_id)

    if animal_passport_number:
        base_query = (
            base_query
            .join(Pets.passport, isouter=True)
            .filter(Passports.passport_number == animal_passport_number)
        )


    total_items = base_query.with_entities(func.count(Pets.pet_id)).scalar()
       
    animals_from_db = base_query\
        .options(
            joinedload(Pets.owner),
            joinedload(Pets.passport)
        )\
        .offset((page - 1) * size)\
        .limit(size)\
        .all()

    response_items = []
    for pet in animals_from_db:
        animal_passport = pet.passport.passport_number if pet.passport else None
        
        
        owner_data = None
        if org_type != 'Ветклініка' and pet.owner:
            owner_data = OwnerForOrgResponse(passport_number=pet.owner.passport_number)
        
        response_items.append(
            AnimalForOrgResponse(
                pet_id=pet.pet_id,
                species=pet.species,
                breed=pet.breed,
                gender=pet.gender,
                animal_passport_number=animal_passport,
                owner=owner_data
            )
        )

    return PaginatedAnimalResponse(
        total_items=total_items,
        total_pages=math.ceil(total_items / size) if total_items > 0 else 0,
        page=page,
        size=size,
        items=response_items
    )


@router.get("/info/", response_model=GetOrgInfo)
async def get_info(db: db_dependency, 
    organization_user: Annotated[Organizations, Depends(get_current_organization)]
    ):
    org = db.query(Organizations).filter(organization_user.organization_id == Organizations.organization_id).first()

    return GetOrgInfo(
        organization_name=org.organization_name,
        organization_type=org.organization_type,
        city=org.city,
        street=org.street,
        building=org.building,
        phone_number=org.phone_number,
        email=org.email
    )


@router.get("/pet/{pet_id}")
async def get_pet_info(
    pet_id: int,
    db: db_dependency,
    organization_user: Annotated[Organizations, Depends(get_current_organization)]
):
    pet = db.query(Pets).filter(Pets.pet_id == pet_id).first()

    if pet is None:
        raise HTTPException(status_code=404, detail="Тваринку не знайдено")

    passport = pet.passport
    organization = passport.organization if passport else None
    identifier = pet.identifiers[0] if pet.identifiers else None
    translation = GoogleTranslator(source='auto', target='en').translate(pet.pet_name)

    org_type = organization_user.organization_type

    if org_type == "Притулок":
        return AnimaForlLintel(
            pet_id=pet.pet_id,
            passport_number=passport.passport_number if passport else "—",
            img_url=pet.img_url,
            pet_name=pet.pet_name,
            pet_name_en=translation,
            date_of_birth=pet.date_of_birth,
            breed=pet.breed,
            gender=pet.gender,
            color=pet.color,
            species=pet.species,
        )

    elif org_type == "Ветклініка":
        return AnimalForVeterinary(
            pet_id=pet.pet_id,
            passport_number=passport.passport_number if passport else "—",
            img_url=pet.img_url,
            pet_name=pet.pet_name,
            pet_name_en=translation,
            date_of_birth=pet.date_of_birth,
            breed=pet.breed,
            gender=pet.gender,
            color=pet.color,
            species=pet.species,
            organization_name=organization.organization_name if organization else "—",
            identifier_type=identifier.identifier_type if identifier else "—",
            date=identifier.date if identifier else None,
            identifier_number=identifier.identifier_number if identifier else "—",
        )

    elif org_type == "ЦНАП":
        return AnimaForCnap(
            pet_id=pet.pet_id,
            passport_number=passport.passport_number if passport else "—",
            img_url=pet.img_url,
            pet_name=pet.pet_name,
            pet_name_en=translation,
            date_of_birth=pet.date_of_birth,
            breed=pet.breed,
            gender=pet.gender,
            color=pet.color,
            species=pet.species,
            organization_name=organization.organization_name if organization else "—",
            identifier_type=identifier.identifier_type if identifier else "—",
            date=identifier.date if identifier else None,
            identifier_number=identifier.identifier_number if identifier else "—",
        )

    else:
        raise HTTPException(status_code=403, detail="Немає доступу")
    
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
    
    
@router.post("/pets/{pet_id}/identifier", response_model=IdentifierResponse)
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
    
