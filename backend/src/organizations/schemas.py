import re
from enum import Enum
from pydantic import Field, EmailStr, field_validator
from pydantic import BaseModel
from typing import List
from src.users.schemas import SupportedCities

class OrgType(str, Enum):
    vet = "Ветклініка"
    shelter = "Притулок"


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


class ReadPersonalInformationByOrg(BaseModel):
    organization_name: str
    organization_type: str
    city: str
    street: str
    building: str
    phone_number: str
    email: str

class ReadAllOrganizations(BaseModel):
  organization_id:int
  organization_name:str
  organization_type:str
  city:str
  street:str
  building:str
  phone_number:str
  email:str


class CreateNewOrganization(BaseModel):
    organization_name:str = Field(min_length=3, max_length=100)
    organization_type:OrgType
    city:SupportedCities
    street:str = Field(min_length=3, max_length=100)
    building:str = Field(min_length=1, max_length=10)
    phone_number:str = Field(min_length=3, max_length=20)
    email:EmailStr

    @field_validator("organization_name")
    @classmethod
    def validate_org_name(cls, v: str):
        v = v.strip()

        v = re.sub(r'\s+', ' ', v)

        if not v:
            raise ValueError("Назва організації не може бути порожньою")

        if not re.match(r"^[А-Яа-яІіЇїЄєҐґ0-9\s\-\"\'№.,()!]+$", v):
            raise ValueError("Назва організації має бути кирилицею (без латиниці)")

        return v


    @field_validator("street")
    @classmethod
    def validate_street(cls, v: str):
        if not re.match(r"^[А-Яа-яІіЇїЄєҐґ0-9\-\s\'.]+$", v):
            raise ValueError("Назва вулиці містить недопустимі символи")
        return v.title()

    @field_validator("building")
    @classmethod
    def validate_building(cls, v: str):
        v = v.upper().strip()
        if not re.match(r"^[0-9А-ЯІЇЄA-Z\-\/]+$", v):
            raise ValueError("Номер будинку містить некоректні символи")
        if not v[0].isdigit():
            raise ValueError("Номер будинку повинен починатися з цифри")
        return v

    @field_validator("phone_number")
    @classmethod
    def validate_phone(cls, v: str):
        clean_number = re.sub(r'\D', '', v)

        if clean_number.startswith('380') and len(clean_number) == 12:
            pass
        elif clean_number.startswith('0') and len(clean_number) == 10:
            clean_number = '38' + clean_number
        else:
            raise ValueError("Невірний формат номеру телефону (очікується формат +380...)")

        return f"+{clean_number}"


class UpdateOrganization(CreateNewOrganization):
   pass


