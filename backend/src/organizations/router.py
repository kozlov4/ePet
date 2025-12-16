from typing import Annotated, Optional, Union, List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload
from src.db.database import get_db
from src.db.models import Organizations, Cnap
from src.authentication.service import get_current_user
from src.organizations.service import  get_current_org_or_cnap
from src.organizations.schemas import PaginatedAnimalResponse,  ReadPersonalInformationByOrg, ReadAllOrganizations, CreateNewOrganization, UpdateOrganization, ShelterRequestResponse
from src.organizations.service import read_all_animals_service, read_personal_info_service, read_all_organizations_service, create_new_organization_service, update_organization_service, delete_organization_service, get_requests_for_shelter_service
from src.db.models import  Requests, Users

router = APIRouter(tags=['Organizations 🏢'], prefix="/organizations")

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]


@router.get('/animals/', response_model=PaginatedAnimalResponse)
async def read_all_animals_route(
        db: db_dependency,
        org_or_cnap: Annotated[Union[Organizations, Cnap], Depends(get_current_org_or_cnap)],
        page: Annotated[int, Query(ge=1, description="Номер сторінки")] = 1,
        size: Annotated[int, Query(ge=1, le=100, description="Кількість записів на сторінці")] = 6,
        animal_passport_number: Optional[str] = Query(None, description="Номер паспорта тварини для пошуку"),
        search: Optional[str] = Query(None, description="Пошук для притулка за всіма атрибутами")
):
    return read_all_animals_service(db=db, org_or_cnap=org_or_cnap, page=page, size=size, animal_passport_number=animal_passport_number, search=search)


@router.get("/info/", response_model=ReadPersonalInformationByOrg)
async def read_personal_info_route(
        org_or_cnap: Annotated[Optional[Union[Organizations, Cnap]], Depends(get_current_org_or_cnap)]
):
    return read_personal_info_service(org_or_cnap=org_or_cnap)


@router.get("/organizations/", response_model=List[ReadAllOrganizations])
async def read_all_organizations_route(
        db: db_dependency,
        cnap: Annotated[Cnap, Depends(get_current_org_or_cnap)],
        organization_name: Optional[str] = Query(None, description="Пошук за назвою організації"),
):
    return read_all_organizations_service(db=db, cnap=cnap, organization_name=organization_name)


@router.get("/organization/list", response_model=List[ShelterRequestResponse])
async def get_requests_for_shelter_route(
        db: db_dependency,
        org_user: Annotated[Union[Organizations, Cnap, None], Depends(get_current_org_or_cnap)],
):
    return get_requests_for_shelter_service(db=db, org_user=org_user)



@router.post("/create/", status_code=201)
async def create_new_organization_route(
        db: db_dependency,
        data: CreateNewOrganization,
        org_or_cnap: Annotated[Union[Cnap, None], Depends(get_current_org_or_cnap)] = None
):
    return create_new_organization_service(db=db,data=data, org_or_cnap=org_or_cnap)


@router.put("/organizations/{org_id}")
async def update_organization_route(
        db: db_dependency,
        org_id: int,
        upd_data: UpdateOrganization,
        org_or_cnap: Annotated[Union[Cnap, None], Depends(get_current_org_or_cnap)] = None,
):
    return update_organization_service(db=db, org_id=org_id, upd_data=upd_data, org_or_cnap=org_or_cnap)


@router.delete("/organizations/{org_id}", status_code=204)
async def delete_organization_route(
        db: db_dependency,
        org_id: int,
        org_or_cnap: Annotated[Union[Cnap, None], Depends(get_current_org_or_cnap)] = None,
):
    return delete_organization_service(db=db, org_id=org_id, org_or_cnap=org_or_cnap)

