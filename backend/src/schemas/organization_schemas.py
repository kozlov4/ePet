from pydantic import BaseModel
from typing import List

class OwnerForOrgResponse(BaseModel):
    passport_number: str | None = None

    class Config:
        from_attributes = True

class AnimalForOrgResponse(BaseModel):
    species: str
    breed: str
    gender: str
    animal_passport_number: str | None = None
    owner: OwnerForOrgResponse | None = None

    class Config:
        from_attributes = True

class PaginatedAnimalResponse(BaseModel):
    total_items: int
    total_pages: int
    page: int
    size: int
    items: List[AnimalForOrgResponse]


class GetOrgInfo(BaseModel):
    organization_name:str
    organization_type:str
    city:str
    street:str
    building:str
    phone_number:str
    email:str
