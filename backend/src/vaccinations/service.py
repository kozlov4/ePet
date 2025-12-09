from datetime import datetime
from typing import Annotated, Union
from fastapi import  Depends, HTTPException
from sqlalchemy.orm import Session
from src.db.database import get_db
from src.db.models import Pets, Vaccinations, Organizations, Cnap
from src.authentication.service import  get_current_user
from src.organizations.service import   get_current_org_or_cnap
from src.vaccinations.schemas import CreateVaccination


db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]


def add_vaccination_service(pet_id: int, db: Session, data:CreateVaccination, org_user: Annotated[Union[Organizations, Cnap, None], Depends(get_current_org_or_cnap)]):
    if not isinstance(org_user, Organizations) or org_user.organization_type != "Ветклініка":
        raise HTTPException(
            status_code=403,
            detail="Додати вакцинацію може лише ветклініка"
        )

    pet = db.query(Pets).filter(Pets.pet_id == pet_id).first()
    if not pet:
        raise HTTPException(status_code=404, detail="Тваринку не знайдено")

    vac_date_obj = datetime.strptime(data.vaccination_date, "%d.%m.%Y").date()
    valid_until_obj = datetime.strptime(data.valid_until, "%d.%m.%Y").date()

    vaccination = Vaccinations(
        pet_id=pet_id,
        drug_name=data.drug_name,
        series_number=data.series_number,
        vaccination_date=vac_date_obj,
        valid_until=valid_until_obj,
        organization_id=org_user.organization_id
    )

    db.add(vaccination)
    db.commit()
    db.refresh(vaccination)

    return CreateVaccination(
        drug_name=vaccination.drug_name,
        series_number=vaccination.series_number,
        vaccination_date=vaccination.vaccination_date.strftime("%d.%m.%Y"),
        valid_until=vaccination.valid_until.strftime("%d.%m.%Y")
    )


