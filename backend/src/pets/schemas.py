from enum import Enum
from datetime import date
from typing import Optional
from fastapi import Form, HTTPException, status
from pydantic import BaseModel, field_validator, ValidationError, ConfigDict
import re

UKRAINIAN_TEXT_REGEX = re.compile(r"^[А-Яа-яІіЇїЄєҐґ\s\-\']+$")


class GenderEnum(str, Enum):
    male = "Ч"
    female = "Ж"


class PetCreateForm(BaseModel):
    pet_name: str
    gender: GenderEnum
    breed: str
    species: str
    color: str
    date_of_birth: date

    identifier_type: Optional[str] = None
    identifier_number: Optional[str] = None
    chip_date: Optional[date] = None
    owner_passport_number: Optional[str] = None

    @field_validator("pet_name", "breed", "species", "color", "identifier_type")
    @classmethod
    def validate_strict_cyrillic(cls, v: Optional[str], info):
        if v is None: return v
        clean_value = v.strip().title()
        if not UKRAINIAN_TEXT_REGEX.match(clean_value):
            raise ValueError(f"Поле '{info.field_name}' має містити ТІЛЬКИ кирилицю")
        return clean_value

    @field_validator("gender", mode="before")
    @classmethod
    def validate_gender(cls, v: str):
        v = v.strip().upper()
        if v not in ("Ч", "Ж"):
            raise ValueError("Стать має бути 'Ч' або 'Ж'")
        return v

    @field_validator("date_of_birth", "chip_date")
    @classmethod
    def validate_dates(cls, v: Optional[date], info):
        if v and v > date.today():
            raise ValueError(f"Дата в полі '{info.field_name}' не може бути в майбутньому")
        return v

    @classmethod
    def as_form(
            cls,
            pet_name: str = Form(..., min_length=2, max_length=50),
            gender: str = Form(..., min_length=1, max_length=1),
            breed: str = Form(..., min_length=2, max_length=50),
            species: str = Form(..., min_length=2, max_length=50),
            color: str = Form(..., min_length=2, max_length=30),
            date_of_birth: date = Form(...),

            identifier_type: Optional[str] = Form(None),
            identifier_number: Optional[str] = Form(None),
            chip_date: Optional[str] = Form(None),
            owner_passport_number: Optional[str] = Form(None)
    ):
        def clean(value):
            if not value: return None
            if value == "string": return None
            return value

        cleaned_chip_date = clean(chip_date)

        try:
            return cls(
                pet_name=pet_name,
                gender=gender,
                breed=breed,
                species=species,
                color=color,
                date_of_birth=date_of_birth,
                identifier_type=clean(identifier_type),
                identifier_number=clean(identifier_number),
                chip_date=cleaned_chip_date,
                owner_passport_number=clean(owner_passport_number)
            )
        except ValidationError as e:
            errors = []
            for err in e.errors():
                msg = err.get("msg")
                loc = err.get("loc")[-1]
                errors.append(f"{loc}: {msg}")

            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=errors
            )



class ReadPetBase(BaseModel):
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


class ReadPetForLintel(ReadPetBase):
    pass


class ReadPetForVeterinary(ReadPetBase):
    passport_number: str
    organization_id: Optional[int]
    owner_passport_number: str
    identifier_type: str
    identifier_type_en: str
    date: Optional[str] = None
    identifier_number: str


class ReadPetForCnap(ReadPetForVeterinary):
    pass


class ReadPetForUser(ReadPetForVeterinary):
    model_config = ConfigDict(from_attributes=True)

    update_datetime: str


class PetUpdateRequest(BaseModel):
    pet_name: Optional[str] = None
    gender: Optional[GenderEnum] = None
    breed: Optional[str] = None
    species: Optional[str] = None
    color: Optional[str] = None
    date_of_birth: Optional[date] = None


    @field_validator("pet_name", "breed", "species", "color")
    @classmethod
    def validate_strict_cyrillic(cls, v: Optional[str], info):
        if v is None: return v
        clean_value = v.strip().title()
        if not UKRAINIAN_TEXT_REGEX.match(clean_value):
            raise ValueError(f"Поле '{info.field_name}' має містити ТІЛЬКИ кирилицю")
        return clean_value

    @field_validator("gender", mode="before")
    @classmethod
    def validate_gender(cls, v: Optional[str]):
        if v is None: return v
        v = v.strip().upper()
        if v not in ("Ч", "Ж"):
            raise ValueError("Стать має бути 'Ч' або 'Ж'")
        return v

    @field_validator("date_of_birth")
    @classmethod
    def validate_dates(cls, v: Optional[date], info):
        if v and v > date.today():
            raise ValueError(f"Дата в полі '{info.field_name}' не може бути в майбутньому")
        return v

    @classmethod
    def as_form(
            cls,
            pet_name: Optional[str] = Form(None, min_length=2, max_length=50),
            gender: Optional[str] = Form(None, min_length=1, max_length=1),
            breed: Optional[str] = Form(None, min_length=2, max_length=50),
            species: Optional[str] = Form(None, min_length=2, max_length=50),
            color: Optional[str] = Form(None, min_length=2, max_length=30),
            date_of_birth: Optional[str] = Form(None)
    ):
        def clean(value):
            if not value: return None
            if value == "string": return None
            return value

        dob = clean(date_of_birth)

        try:
            return cls(
                pet_name=clean(pet_name),
                gender=clean(gender),
                breed=clean(breed),
                species=clean(species),
                color=clean(color),
                date_of_birth=dob
            )
        except ValidationError as e:
            errors = []
            for err in e.errors():
                msg = err.get("msg")
                loc = err.get("loc")[-1]
                errors.append(f"{loc}: {msg}")

            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=errors
            )

class ReportRequest(BaseModel):
    pet_id: int
    name_document: str