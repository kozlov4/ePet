from typing import Annotated, Optional, Union, List
import math
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, or_
from sqlalchemy.testing.pickleable import User

from src.db.database import get_db
from src.db.models import Organizations, Pets, Passports, Cnap, Users, Requests
from src.authentication.service import get_current_user, bcrypt_context
from src.organizations.schemas import OwnerForOrgResponse, AnimalForOrgResponse, PaginatedAnimalResponse, \
    ReadPersonalInformationByOrg, ReadAllOrganizations, CreateNewOrganization, UpdateOrganization, ShelterRequestResponse

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

#TODO Видалити paginated
def read_all_animals_service(
        db:Session,
        org_or_cnap: Annotated[Union[Organizations, Cnap], Depends(get_current_org_or_cnap)],
        page:int,
        size:int,
        animal_passport_number:str = None,
        search: str = None):
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

    if search:
        base_query = base_query.outerjoin(Pets.passport)

        search_pattern = f"%{search}%"

        base_query = base_query.filter(
            or_(
                Pets.species.ilike(search_pattern),
                Pets.breed.ilike(search_pattern),
                Passports.passport_number.ilike(search_pattern),
            )
        )

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

        if pet.owner:
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


def read_personal_info_service(org_or_cnap:Annotated[Optional[Union[Organizations, Cnap]], Depends(get_current_org_or_cnap)]):
    if isinstance(org_or_cnap, Organizations):
        org = org_or_cnap
        return ReadPersonalInformationByOrg(
            organization_name=org.organization_name,
            organization_type=org.organization_type,
            city=org.city,
            street=org.street,
            building=org.building,
            phone_number=org.phone_number,
            email=org.email
        )
    if isinstance(org_or_cnap, Cnap):
        cnap = org_or_cnap
        return ReadPersonalInformationByOrg(
            organization_name=cnap.name,
            organization_type="Центр надання адміністративних послуг (ЦНАП)",
            city=cnap.city,
            street=cnap.street,
            building=cnap.building,
            phone_number=cnap.phone_number,
            email=cnap.email
        )

    raise HTTPException(403, "Доступ тільки для організацій або ЦНАП.")


def read_all_organizations_service(
    db: Session,
    cnap: Annotated[Cnap, Depends(get_current_org_or_cnap)],
    organization_name: Optional[str] = None
):
    if cnap is None:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="У вас немає доступу")

    query = db.query(Organizations).filter(Organizations.cnap_id == cnap.cnap_id)

    if organization_name:
        query = query.filter(Organizations.organization_name == organization_name)

    orgs = query.all()

    return [
        ReadAllOrganizations(
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


def create_new_organization_service(db:Session, data: CreateNewOrganization, org_or_cnap:Annotated[Union[Cnap, None], Depends(get_current_org_or_cnap)] = None):
    if not isinstance(org_or_cnap, Cnap):
        raise HTTPException(
            status_code=403,
            detail="Додавати організації може лише ЦНАП"
        )

    org_default_password = bcrypt_context.hash("Test12345$")

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

    existing_email = db.query(Organizations).filter(or_(Organizations.email == new_org.email,
                    Organizations.organization_name == new_org.organization_name)).first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ці дані для реєстрації нової організації заборонено"
        )

    db.add(new_org)
    db.commit()
    db.refresh(new_org)

    return {"message": "Організацію успішно додано"}


def update_organization_service(
    db: Session,
    org_id: int,
    upd_data: UpdateOrganization,
    org_or_cnap: Annotated[Union[Cnap, None], Depends(get_current_org_or_cnap)] = None
):
    cur_org = (
        db.query(Organizations)
        .filter(Organizations.organization_id == org_id)
        .first()
    )
    if not cur_org:
        raise HTTPException(status_code=404, detail="Організацію не знайдено")

    if not isinstance(org_or_cnap, Cnap):
        raise HTTPException(
            status_code=403,
            detail="Оновлювати організації може лише ЦНАП"
        )

    if cur_org.cnap_id != org_or_cnap.cnap_id:
        raise HTTPException(
            status_code=403,
            detail="Ви не маєте право змінювати чужі організації"
        )

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

#TODO Видаляти поля в таблицях де є інформація з цією організацією
def delete_organization_service(db:Session, org_id: int, org_or_cnap: Annotated[Union[Cnap, None], Depends(get_current_org_or_cnap)] = None):
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


def get_requests_for_shelter_service(db:Session, org_user:Annotated[Union[Organizations, Cnap, None], Depends(get_current_org_or_cnap)]):
    if not isinstance(org_user, Organizations) or org_user.organization_type != "Притулок":
        raise HTTPException(
            status_code=403,
            detail="Переглядати заявки можуть лише представники притулків"
        )

    requests = (
        db.query(Requests)
        .join(Users, Requests.user_id == Users.user_id)
        .filter(Requests.organization_id == org_user.organization_id)
        .options(joinedload(Requests.user))
        .all()
    )

    result = []
    for req in requests:
        user = req.user

        f_initial = user.first_name[0] if user.first_name else ""
        p_initial = user.patronymic[0] if user.patronymic else ""

        short_name = f"{user.last_name} {f_initial}. {p_initial}."

        date_str = req.creation_date.strftime("%d.%m.%Y") if req.creation_date else "—"

        result.append(ShelterRequestResponse(
            request_id=req.request_id,
            creation_date=date_str,
            user_full_name=short_name,
            user_email=user.email,
            pet_id=req.pet_id
        ))

    return result
