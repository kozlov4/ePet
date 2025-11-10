from typing import Annotated, Optional
import math
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from src.db.database import get_db
from src.db.models import Organizations, Pets, Passports
from src.api.core import  get_current_user
from src.schemas.pet_schemas import AnimalForOrgResponse, OwnerForOrgResponse, PaginatedAnimalResponse, GetOrgInfo



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


async def get_current_organization_optional(user: user_dependency, db: db_dependency) -> Optional[Organizations]:

    user_id = user.get('user_id')
    if user_id is None:

        return None

    organization = db.query(Organizations).filter(
        (Organizations.organization_id == user_id) &
        (Organizations.organization_type.in_(['ЦНАП', 'Ветклініка', 'Притулок']))
    ).first()

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


