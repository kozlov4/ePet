import math
from typing import Annotated, List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload

from src.db.database import get_db
from src.db.models import Organizations, Pets
from src.api.core import get_current_user

from src.schemas.cnap import AnimalForCNAPResponse, OwnerForCNAPResponse, PaginatedAnimalResponse

router = APIRouter(tags=['CNAP 🐾'], prefix="/cnap")

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

# Функція-залежність перевіряє права доступу для ЦНАП
async def get_current_cnap_organization(user: user_dependency, db: db_dependency) -> Organizations:
    user_id = user.get('user_id')
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Не вдалося витягти ID користувача з токена."
        )

    organization = db.query(Organizations).filter(
        Organizations.organization_id == user_id,
        Organizations.organization_type == 'ЦНАП' 
    ).first()
    
    if not organization:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Доступ дозволено тільки для організацій типу ЦНАП."
        )
    return organization


@router.get('/animals', response_model=PaginatedAnimalResponse)
async def get_animals_for_cnap(
    db: db_dependency, 
    # Ця залежність захищає ендпоінт і передає нам об'єкт залогіненої організації
    cnap_user: Annotated[Organizations, Depends(get_current_cnap_organization)],
    page: Annotated[int, Query(ge=1, description="Номер сторінки")] = 1,
    size: Annotated[int, Query(ge=1, le=100, description="Кількість записів на сторінці")] = 6
):
    """
    Повертає список тварин, зареєстрованих 
    САМЕ В ЦІЙ організації ЦНАП.
    """
    

    base_query = db.query(Pets).filter(Pets.organization_id == cnap_user.organization_id)

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
        owner_data = OwnerForCNAPResponse(passport_number=pet.owner.passport_number) if pet.owner else None

        response_items.append(
            AnimalForCNAPResponse(
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