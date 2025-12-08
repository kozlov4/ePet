from typing import Annotated, Union
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from src.db.database import get_db
from src.schemas.vaccination_schemas import VaccinationItem
from src.db.models import Pets, Vaccinations, Organizations, Cnap
from src.authentication.service import  get_current_user
from src.organizations.service import   get_current_org_or_cnap

router = APIRouter(tags=['Vaccinations 💉'], prefix="/vaccinations")
db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

@router.post("/{pet_id}", response_model=VaccinationItem, status_code=201)
async def add_vaccination(
    pet_id: int,
    db: db_dependency,
    data: VaccinationItem,
    org_user: Annotated[Union[Organizations, Cnap, None], Depends(get_current_org_or_cnap)],
):
    # Доступ лише для ветклінік
    if not isinstance(org_user, Organizations) or org_user.organization_type != "Ветклініка":
        raise HTTPException(
            status_code=403,
            detail="Додати вакцинацію може лише ветклініка"
        )

    # Перевіряємо тварину
    pet = db.query(Pets).filter(Pets.pet_id == pet_id).first()
    if not pet:
        raise HTTPException(status_code=404, detail="Тваринку не знайдено")

    # Створення нового запису вакцинації
    vaccination = Vaccinations(
        pet_id=pet_id,
        drug_name=data.drug_name,
        series_number=data.series_number,
        vaccination_date=data.vaccination_date,
        valid_until=data.valid_until,
        organization_id=org_user.organization_id
    )

    db.add(vaccination)
    db.commit()
    db.refresh(vaccination)

    return VaccinationItem(
        drug_name=vaccination.drug_name,
        series_number=vaccination.series_number,
        vaccination_date=vaccination.vaccination_date,
        valid_until=vaccination.valid_until,
        organization_name=org_user.organization_name
    )


