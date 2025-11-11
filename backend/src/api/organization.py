from typing import Annotated, Optional, Union
import math
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from src.db.database import get_db
from src.db.models import Organizations, Pets, Passports, Cnap
from src.api.core import  get_current_user
from src.schemas.pet_schemas import AnimalForOrgResponse, OwnerForOrgResponse, PaginatedAnimalResponse, GetOrgInfo



router = APIRouter(tags=['Organizations 🏢'], prefix="/organizations")
db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]



async def get_current_organization(user: user_dependency, db: db_dependency) -> Organizations:

    email = user.get("username")

 
    if email is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Не вдалося витягти email користувача з токена."
        )
 
    organization = db.query(Organizations).filter(
        Organizations.email == email
    ).first()

    if organization and organization.organization_type in ['Ветклініка', 'Притулок']:
        return organization

    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Доступ дозволено тільки для Організацій ('Ветклініка', 'Притулок')."
    )



async def get_current_cnap_optional(user: user_dependency, db: db_dependency) -> Optional[Cnap]:

    email = user.get("username") 
    if email is None:
        return None

    cnap = db.query(Cnap).filter(Cnap.email == email).first()
    return cnap


async def get_current_organization_optional(user: user_dependency, db: db_dependency) -> Optional[Organizations]:

    email = user.get("username") 
    if email is None:
        return None

    organization = db.query(Organizations).filter(
        (Organizations.email == email) &
        (Organizations.organization_type.in_(['Ветклініка', 'Притулок']))
    ).first()

    return organization



async def get_current_org_or_cnap(
    user: user_dependency, 
    db: db_dependency
) -> Optional[Union[Organizations, Cnap]]:

    email = user.get("username")
    if not email:
        return None

    org = db.query(Organizations).filter(Organizations.email == email).first()
    if org:
        return org  

    cnap = db.query(Cnap).filter(Cnap.email == email).first()
    if cnap:
        return cnap  

        
    return None

@router.get('/animals/', response_model=PaginatedAnimalResponse)
async def get_animals_for_org(
    db: db_dependency,
    org_or_cnap: Annotated[Union[Organizations, Cnap], Depends(get_current_org_or_cnap)],
    page: Annotated[int, Query(ge=1, description="Номер сторінки")] = 1,
    size: Annotated[int, Query(ge=1, le=100, description="Кількість записів на сторінці")] = 6,
    animal_passport_number: Optional[str] = Query(None, description="Номер паспорта тварини для пошуку")
):
    if isinstance(org_or_cnap, Organizations):
        org_type = org_or_cnap.organization_type
        org_id = org_or_cnap.organization_id
        is_cnap = False
    elif isinstance(org_or_cnap, Cnap):
        org_type = "ЦНАП"
        org_id = None
        is_cnap = True
    else:
        raise HTTPException(status_code=403, detail="Доступ тільки для організацій або ЦНАП.")

    base_query = db.query(Pets)

    if org_type == 'Притулок' and org_id:
        base_query = base_query.filter(Pets.organization_id == org_id)

    if animal_passport_number:
        base_query = (
            base_query
            .join(Pets.passport, isouter=True)
            .filter(Passports.passport_number == animal_passport_number)
        )

    total_items = base_query.with_entities(func.count(Pets.pet_id)).scalar()

    animals_from_db = (
        base_query
        .options(
            joinedload(Pets.owner),
            joinedload(Pets.passport)
        )
        .offset((page - 1) * size)
        .limit(size)
        .all()
    )

    response_items = []
    for pet in animals_from_db:
        animal_passport = pet.passport.passport_number if pet.passport else None

        owner_data = None
        if (org_type != 'Ветклініка' or is_cnap) and pet.owner:
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
async def get_info(
    db: db_dependency,
    org_user: Annotated[Optional[Union[Organizations, Cnap]], Depends(get_current_org_or_cnap)]
):
    if isinstance(org_user, Organizations):
        org = org_user
        return GetOrgInfo(
            organization_name=org.organization_name,
            organization_type=org.organization_type,
            city=org.city,
            street=org.street,
            building=org.building,
            phone_number=org.phone_number,
            email=org.email
        )
    if isinstance(org_user, Cnap):
        cnap = org_user
        return GetOrgInfo(
            organization_name=cnap.name,
            organization_type="ЦНАП",
            city=cnap.city,
            street=cnap.street,
            building=cnap.building,
            phone_number=cnap.phone_number,
            email=cnap.email
        )

    raise HTTPException(403, "Доступ тільки для організацій або ЦНАП.")


