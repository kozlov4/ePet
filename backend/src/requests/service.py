from fastapi import Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload
from typing import Annotated


from src.db.database import get_db
from src.db.models import Requests, Pets
from src.authentication.service import get_current_user
from src.requests.schemas import RequestCreate, RequestPetsList
from src.db.models import Users, Organizations


db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]


def create_request_service(request_data:RequestCreate, user:user_dependency, db:Session):
    user_id = user.get('user_id')

    pet = db.query(Pets).options(joinedload(Pets.organization)).filter(Pets.pet_id == request_data.pet_id).first()

    if not pet:
        raise HTTPException(status_code=404, detail="Тваринку не знайдено")

    if not pet.organization:
        raise HTTPException(status_code=500, detail="Помилка даних: Тварина не прикріплена до організації.")

    if pet.organization.organization_type != "Притулок":
        raise HTTPException(
            status_code=400,
            detail=f"Подавати заявку на усиновлення/опіку можна лише в притулки. Ця тварина зареєстрована в '{pet.organization.organization_type}'."
        )

    if pet.user_id == user_id:
        raise HTTPException(
            status_code=400,
            detail="Ви не можете подати заявку на власну тварину"
        )

    existing_request = db.query(Requests).filter(
        Requests.user_id == user_id,
        Requests.pet_id == request_data.pet_id
    ).first()

    if existing_request:
        raise HTTPException(
            status_code=400,
            detail="Ви вже подали заявку на цю тварину."
        )

    new_request = Requests(
        pet_id=request_data.pet_id,
        user_id=user_id,
        organization_id=pet.organization_id
    )

    db.add(new_request)
    db.commit()
    db.refresh(new_request)

    return {
        "message": "Заявку успішно надіслано в притулок",
        "request_id": new_request.request_id,
        "shelter_name": pet.organization.organization_name
    }


def read_list_requests_service(db: Session, user_id: int):
    user = db.query(Users).filter(Users.user_id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=403,
            detail="Доступ заборонено: користувача не знайдено"
        )

    user_city = user.city

    if not user_city:
        raise HTTPException(
            status_code=400,
            detail="У профілі користувача не вказано місто"
        )

    pets = (
        db.query(Pets)
        .join(Organizations, Pets.organization_id == Organizations.organization_id)
        .filter(
            Organizations.city == user_city,
            Organizations.organization_type == "Притулок"
        )
        .options(joinedload(Pets.organization))
        .order_by(func.random())
        .all()
    )

    result = []
    for pet in pets:
        result.append(RequestPetsList(
            pet_id=pet.pet_id,
            pet_name=pet.pet_name,
            gender=pet.gender,
            breed=pet.breed,
            date_of_birth=pet.date_of_birth,
            img_url=pet.img_url,
        ))

    return result