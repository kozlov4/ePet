from typing import Annotated, Union
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.db.database import get_db
from src.db.models import  Organizations, Cnap
from src.authentication.service import  get_current_user
from src.organizations.service import   get_current_org_or_cnap
from src.vaccinations.schemas import CreateVaccination
from src.vaccinations.service import add_vaccination_service

router = APIRouter(tags=['Vaccinations 💉'], prefix="/vaccinations")

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

@router.post("/{pet_id}", response_model=CreateVaccination, status_code=201)
async def add_vaccination_route(
    pet_id: int,
    db: db_dependency,
    data: CreateVaccination,
    org_user: Annotated[Union[Organizations, Cnap, None], Depends(get_current_org_or_cnap)],
):
    return add_vaccination_service(pet_id=pet_id, db=db, data=data, org_user=org_user)
