from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class PetDetailsResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    passport_number: Optional[str] = None
    
    pet_name: str
    pet_name_latin: str
    
    date_of_birth: datetime
    
    breed_ua: str
    breed_en: str
    
    gender_ua: str
    gender_en: str
    
    color_ua: str
    color_en: str
    
    species_ua: str
    species_en: str
    
    identifier_type_ua: Optional[str] = None
    identifier_type_en: Optional[str] = None

    owner_passport_number: Optional[str] = None
    organization_id: Optional[int] = None
    
    identifier_number: Optional[str] = None
    identifier_date: Optional[datetime] = None

    update_datetime: str