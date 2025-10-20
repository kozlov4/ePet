from pydantic import BaseModel
from typing import List

class OwnerForCNAPResponse(BaseModel):
    passport_number: str | None = None

    class Config:
        from_attributes = True

class AnimalForCNAPResponse(BaseModel):
    species: str
    breed: str
    gender: str
    animal_passport_number: str | None = None
    owner: OwnerForCNAPResponse | None = None

    class Config:
        from_attributes = True

class PaginatedAnimalResponse(BaseModel):
    total_items: int
    total_pages: int
    page: int
    size: int
    items: List[AnimalForCNAPResponse]