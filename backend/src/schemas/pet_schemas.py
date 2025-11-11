from pydantic import BaseModel, ConfigDict
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class OwnerForOrgResponse(BaseModel):
    passport_number: str | None = None

    class Config:
        from_attributes = True

class AnimalForOrgResponse(BaseModel):
    pet_id:int
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


class AnimalBase(BaseModel):
    pet_id:int
    passport_number:str
    img_url:str
    pet_name:str
    pet_name_en: str
    date_of_birth: datetime 
    breed:str
    breed_en: str
    gender:str
    gender_en: str
    color:str
    color_en: str
    species:str
    species_en: str




class AnimaForlLintel(AnimalBase):
    pass


class AnimalForVeterinary(AnimalBase):
    passport_number:str
    organization_name:str
    owner_passport_number: str
    identifier_type:str
    identifier_type_en: str
    date: Optional[datetime] = None 
    identifier_number:str

class AnimaForCnap(AnimalForVeterinary):
    pass


class AnimalForUser(AnimalForVeterinary):
    model_config = ConfigDict(from_attributes=True)

    update_datetime: str

class AddPetRequest(BaseModel):
    img_url: str
    pet_name: str
    species: str
    breed: Optional[str] = None
    gender: str
    date_of_birth: Optional[datetime] = None
    color: str
    sterilized: Optional[bool] = None           
    owner_passport_number: Optional[str] = None  

class AddIdentifierRequest(BaseModel):
    identifier_number: str         
    identifier_type: str           
    identifier_place: Optional[str] = None
    identifier_date: Optional[datetime] = None
    
class IdentifierResponse(BaseModel):
    pet_id: int
    identifier_number: str
    identifier_type: str
    identifier_place: Optional[str] = None
    date: datetime
    passport_number: Optional[str] = None    