from typing import Annotated, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from src.db.database import get_db
from src.db.models import Organizations, Pets
from src.api.core import get_current_user

from src.schemas.cnap import AnimalForCNAPResponse, OwnerForCNAPResponse

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


@router.get('/animals', response_model=List[AnimalForCNAPResponse])
async def get_animals_for_cnap(
    db: db_dependency, 
    # Ця залежність захищає ендпоінт і передає нам об'єкт залогіненої організації
    cnap_user: Annotated[Organizations, Depends(get_current_cnap_organization)]
):
    """
    Повертає список тварин, зареєстрованих 
    САМЕ В ЦІЙ організації ЦНАП.
    """
    
    animals_from_db = db.query(Pets)\
        .options(
            # Ключова оптимізація: завантажуємо пов'язані дані про власника та паспорт
            # одним SQL-запитом, щоб уникнути проблеми "N+1".
            joinedload(Pets.owner),
            joinedload(Pets.passport)
        )\
        .filter(Pets.organization_id == cnap_user.organization_id)\
        .all()

    response_data = []
    for pet in animals_from_db:
        animal_passport = pet.passport.passport_number if pet.passport else None
        owner_data = OwnerForCNAPResponse(passport_number=pet.owner.passport_number) if pet.owner else None

        response_data.append(
            AnimalForCNAPResponse(
                species=pet.species,
                breed=pet.breed,
                gender=pet.gender,
                animal_passport_number=animal_passport,
                owner=owner_data
            )
        )
    
    return response_data