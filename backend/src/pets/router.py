from fastapi import APIRouter, Depends, HTTPException, status, UploadFile,  File
from sqlalchemy.orm import Session, joinedload
from typing import Union
from sqlalchemy.future import select
from datetime import datetime
from src.db.database import get_db
from src.vaccinations.schemas import VaccinationsListResponse
from src.db.models import Pets, Vaccinations, Organizations, Cnap, Passports, Identifiers, Users, Extracts
from typing import Annotated
from src.authentication.service import get_current_user
from src.organizations.service import get_current_org_or_cnap

from src.pets.service import   add_pet_service, read_pet_information_service, get_pet_vaccinations_service, update_pet_service, generate_report_service, delete_pet_service
from src.pets.schemas import PetCreateForm, PetUpdateRequest, ReportRequest

router = APIRouter(prefix="/pets", tags=["Pets 🐶"])
db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]


@router.get("/{pet_id}")
async def read_pet_information_route(
        pet_id: int,
        db: db_dependency,
        organization_user: Annotated[Union[Organizations, Cnap, None], Depends(get_current_org_or_cnap)],
        user: user_dependency
):
    return read_pet_information_service(pet_id=pet_id, db=db, organization_user=organization_user, user_id=user.get('user_id'))


#TODO додати перевірку для того щоб користувач не міг дивитися не своїч тварин
@router.get("/{pet_id}/vaccinations", response_model=VaccinationsListResponse)
async def get_pet_vaccinations_route(
        pet_id: int,
        db: db_dependency,
        organization_user: Annotated[Union[Organizations, Cnap, None], Depends(get_current_org_or_cnap)],
        user: user_dependency
):
    return get_pet_vaccinations_service(pet_id=pet_id, db=db, organization_user=organization_user, user=user)


@router.post("/", status_code=201)
async def add_pet_route(
        db: db_dependency,
        file: UploadFile = File(...),
        form_data: PetCreateForm = Depends(PetCreateForm.as_form),
        org: Annotated[Union[Organizations, Cnap, None], Depends(get_current_org_or_cnap)] = None
):
    return add_pet_service(db=db, file=file, form_data=form_data, org=org)


@router.post("/{pet_id}/update", status_code=200)
async def update_pet_route(
        pet_id: int,
        db: db_dependency,
        data: PetUpdateRequest = Depends(PetUpdateRequest.as_form),
        actor: Annotated[Union[Organizations, Cnap, None], Depends(get_current_org_or_cnap)] = None
):
    return update_pet_service(pet_id=pet_id, db=db, data=data, actor=actor)


@router.post("/generate-report")
async def generate_report_route(
        request: ReportRequest,
        user: user_dependency,
        db: db_dependency
):
    return await generate_report_service(request=request, user=user, db=db)


@router.delete("/delete/{pet_id}")
async def delete_pet_route(
        pet_id: int,
        org_or_cnap: Annotated[Organizations | Cnap, Depends(get_current_org_or_cnap)],
        db: db_dependency
):
    return delete_pet_service(pet_id=pet_id, org_or_cnap=org_or_cnap, db=db)

