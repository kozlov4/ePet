from typing import Annotated, Optional, Union, List
import math
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from src.db.database import get_db
from src.db.models import Organizations, Pets, Passports, Cnap
from src.api.core import  get_current_user
from src.schemas.pet_schemas import AnimalForOrgResponse, OwnerForOrgResponse, PaginatedAnimalResponse, GetOrgInfo
from src.schemas.organization_schemas import OrganizationsForCnap, CreateOrganization, UpdateOrganization
from src.api.core import bcrypt_context


router = APIRouter(tags=['Organizations 🏢'], prefix="/organizations")
db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]



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

    if org_type in ["ЦНАП", "Ветклініка"]:
        base_query = (
        base_query
        .join(Pets.organization)
        .filter(Organizations.organization_type != "Притулок")
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


@router.get("/organizations/", response_model=List[OrganizationsForCnap])
async def get_all_organizations(
    db: db_dependency,
    cnap: Annotated[Cnap, Depends(get_current_org_or_cnap)]
):
    if cnap is None:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="only cnap can gets organizations")
    orgs = db.query(Organizations).filter(Organizations.cnap_id == cnap.cnap_id).all()

    return [
        OrganizationsForCnap(
            organization_id=o.organization_id,
            organization_name=o.organization_name,
            organization_type=o.organization_type,
            city=o.city,
            street=o.street,
            building=o.building,
            phone_number=o.phone_number,
            email=o.email
        )
        for o in orgs
    ]

@router.post("/create/", status_code=201)
async def create_new_organization(
    db: db_dependency,
    data: CreateOrganization,
    org_or_cnap: Annotated[Union[Cnap, None], Depends(get_current_org_or_cnap)] = None
):

    if isinstance(org_or_cnap, Organizations):
        raise HTTPException(status_code=403, detail="Доступ тільки для ЦНАП.")

    elif isinstance(org_or_cnap, Cnap):
        org_type = "ЦНАП"
        is_cnap = True
    else:
        raise HTTPException(status_code=403, detail="Доступ тільки для організацій або ЦНАП.")

    if org_type != "ЦНАП":
        raise HTTPException(status_code=403, detail="Додавати організції можуть лише ЦНАПи")

    org_default_password = bcrypt_context.hash("test12345")

    new_org = Organizations(
        organization_name=data.organization_name,
        organization_type=data.organization_type,
        city=data.city,
        street=data.street,
        building=data.building,
        phone_number=data.phone_number,
        email=data.email,
        password=org_default_password,
        cnap_id=org_or_cnap.cnap_id
    )

    existing_email = db.query(Organizations).filter(Organizations.email == new_org.email).first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Цю пошту використовувати заборонено"
        )

    db.add(new_org)
    db.commit()
    db.refresh(new_org)

    return {"message": "Організацію успішно додано"}


@router.put("/organizations/{org_id}")
async def update_organization(
    db: db_dependency,
    org_id: int,
    upd_data: UpdateOrganization,
    org_or_cnap: Annotated[Union[Cnap, None], Depends(get_current_org_or_cnap)] = None,
):

    cur_org = db.query(Organizations).filter(Organizations.organization_id == org_id).first()

    if cur_org is None:
        raise HTTPException(status_code=403, detail="Організацію не знайдено")

    if isinstance(org_or_cnap, Organizations):
        raise HTTPException(status_code=403, detail="Доступ тільки для ЦНАП.")

    elif isinstance(org_or_cnap, Cnap):
        org_type = "ЦНАП"
    else:
        raise HTTPException(status_code=403, detail="Доступ тільки для організацій або ЦНАП.")

    if org_type != "ЦНАП":
        raise HTTPException(status_code=403, detail="Додавати організції можуть лише ЦНАПи")

    existing_email = (
        db.query(Organizations)
        .filter(Organizations.email == upd_data.email)
        .filter(Organizations.organization_id != cur_org.organization_id)
        .first()
    )

    if existing_email:
        raise HTTPException(status_code=409, detail="Цю пошту використовувати заборонено")

    cur_org.organization_name = upd_data.organization_name
    cur_org.organization_type = upd_data.organization_type
    cur_org.city = upd_data.city
    cur_org.street = upd_data.street
    cur_org.building = upd_data.building
    cur_org.phone_number = upd_data.phone_number
    cur_org.email = upd_data.email

    db.commit()
    db.refresh(cur_org)
    return cur_org


@router.delete("/organizations/{org_id}", status_code=204)
async def delete_organization(
    db: db_dependency,
    org_id: int,
    org_or_cnap: Annotated[Union[Cnap, None], Depends(get_current_org_or_cnap)] = None,
):

    cur_org = db.query(Organizations).filter(Organizations.organization_id == org_id).first()
    if cur_org is None:
        raise HTTPException(status_code=404, detail="Організацію не знайдено")

    if not isinstance(org_or_cnap, Cnap):
        raise HTTPException(status_code=403, detail="Видаляти організації можуть лише ЦНАПи.")

    if cur_org.cnap_id != org_or_cnap.cnap_id:
        raise HTTPException(status_code=403, detail="Ви можете видалити лише свої організації.")

    db.delete(cur_org)
    db.commit()

    return

