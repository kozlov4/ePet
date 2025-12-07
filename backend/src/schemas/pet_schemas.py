from pydantic import BaseModel, ConfigDict, Field
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, date


class OwnerForOrgResponse(BaseModel):
    passport_number: str | None = None

    class Config:
        from_attributes = True


class AnimalForOrgResponse(BaseModel):
    pet_id: int
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
    organization_name: str
    organization_type: str
    city: str
    street: str
    building: str
    phone_number: str
    email: str


class AnimalBase(BaseModel):
    pet_id: int
    passport_number: str
    img_url: str
    pet_name: str
    pet_name_en: str
    date_of_birth: str
    breed: str
    breed_en: str
    gender: str
    gender_en: str
    color: str
    color_en: str
    species: str
    species_en: str


class AnimaForlLintel(AnimalBase):
    pass


class AnimalForVeterinary(AnimalBase):
    passport_number: str
    organization_id: Optional[int]
    owner_passport_number: str
    identifier_type: str
    identifier_type_en: str
    date: Optional[str] = None
    identifier_number: str


class AnimaForCnap(AnimalForVeterinary):
    pass


class AnimalForUser(AnimalForVeterinary):
    model_config = ConfigDict(from_attributes=True)

    update_datetime: str


class AddPetRequest(BaseModel):
    img_url: str
    pet_name: str = Field(min_length=3, max_length=100)
    gender: str = Field(min_length=1, max_length=10)
    breed: str = Field(min_length=3, max_length=50)
    species: str = Field(min_length=3, max_length=50)
    color: str = Field(min_length=3, max_length=30)
    identifier_type: str = Field(min_length=3, max_length=500)
    date: date
    identifier_number: str = Field(min_length=3, max_length=50)
    owner_passport_number: str = Field(min_length=3, max_length=20)


class PetBaseUpdate(BaseModel):
    pet_name: Optional[str] = None
    gender: Optional[str] = None
    breed: Optional[str] = None
    species: Optional[str] = None
    color: Optional[str] = None
    date_of_birth: Optional[date] = None


class IdentifierUpdate(BaseModel):
    identifier_type: Optional[str] = None
    identifier_number: Optional[str] = None
    chip_date: Optional[date] = None


class OwnerUpdate(BaseModel):
    owner_passport_number: Optional[str] = None
