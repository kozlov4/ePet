from typing import Annotated
import math
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from src.db.database import get_db
from src.db.models import Organizations, Pets
from src.schemas.token_schemas import TokenResponse
from src.api.core import create_access_token, bcrypt_context, get_current_user
from src.schemas.organization_schemas import AnimalForOrgResponse, OwnerForOrgResponse, PaginatedAnimalResponse



router = APIRouter(tags=['Organizations 🏢'], prefix="/organizations")
db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]



@router.post('/login', response_model=TokenResponse)
async def login_for_organization(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: db_dependency):
    
    organization = db.query(Organizations).filter(Organizations.email == form_data.username).first()
    
    if not organization:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Organization not found.")

    if not bcrypt_context.verify(form_data.password, organization.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect password.")

    token = create_access_token(
        subject=organization.email, 
        id=organization.organization_id, 
        expires_delta=timedelta(minutes=30) 
    )

    return {
        "access_token": token, 
        "token_type": "bearer", 
        "user_name": organization.organization_name
    }


# Функція-залежність перевіряє права доступу для organizations
async def get_current_organization(user: user_dependency, db: db_dependency) -> Organizations:
    user_id = user.get('user_id')
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Не вдалося витягти ID організації з токена."
        )

    organization = db.query(Organizations).filter(
        (Organizations.organization_id == user_id) &
        (Organizations.organization_type.in_(['ЦНАП', 'ветклініка', 'притулок']))
    ).first()
    
    if not organization:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Доступ дозволено тільки для організацій."
        )
    return organization


@router.get('/animals', response_model=PaginatedAnimalResponse)
async def get_animals_for_cnap(
    db: db_dependency, 
    # Ця залежність захищає ендпоінт і передає нам об'єкт залогіненої організації
    organization_user: Annotated[Organizations, Depends(get_current_organization)],
    page: Annotated[int, Query(ge=1, description="Номер сторінки")] = 1,
    size: Annotated[int, Query(ge=1, le=100, description="Кількість записів на сторінці")] = 6
):
    """
    Повертає список тварин, зареєстрованих 
    САМЕ В ЦІЙ організації ЦНАП.
    """
    

    org_type = organization_user.organization_type

    base_query = db.query(Pets)


    if org_type == 'притулок':
        base_query = base_query.filter(Pets.organization_id == organization_user.organization_id)

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
        if org_type != 'ветклініка' and pet.owner:
            owner_data = OwnerForOrgResponse(passport_number=pet.owner.passport_number)
        
        response_items.append(
            AnimalForOrgResponse(
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
