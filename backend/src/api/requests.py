from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from typing import Annotated

from src.db.database import get_db
from src.db.models import Requests, Pets
from src.authentication.service import get_current_user
from src.schemas.request_schemas import RequestCreate

router = APIRouter(prefix="/requests", tags=["Requests 📝"])

@router.post("/apply", status_code=status.HTTP_201_CREATED)
async def create_request(
    request_data: RequestCreate,
    user: Annotated[dict, Depends(get_current_user)],
    db: Session = Depends(get_db)
):
    user_id = user.get('user_id')

    pet = db.query(Pets).options(joinedload(Pets.organization)).filter(Pets.pet_id == request_data.pet_id).first()
    
    if not pet:
        raise HTTPException(
            status_code=404, 
            detail="Тваринку не знайдено"
        )

    if not pet.organization:
        print(f"CRITICAL ERROR: Pet {pet.pet_id} has no organization linked!")
        raise HTTPException(
            status_code=500, 
            detail="Помилка даних: Тварина не прикріплена до організації."
        )

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
        Requests.pet_id == request_data.pet_id,
        Requests.status == "New"
    ).first()

    if existing_request:
        raise HTTPException(
            status_code=400, 
            detail="Ви вже подали заявку на цю тварину. Очікуйте відповіді від притулку."
        )

    new_request = Requests(
        pet_id=request_data.pet_id,
        user_id=user_id,
        organization_id=pet.organization_id,
        
        status="New",
        request_type="Adoption" 
    )

    db.add(new_request)
    db.commit()
    db.refresh(new_request)

    return {
        "message": "Заявку успішно надіслано в притулок",
        "request_id": new_request.request_id,
        "shelter_name": pet.organization.organization_name,
        "status": new_request.status
    }