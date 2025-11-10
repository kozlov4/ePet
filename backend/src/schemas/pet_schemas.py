from pydantic import BaseModel, ConfigDict

class PetDetailsResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    passport_number: str
    img_url: str
    pet_name: str
    pet_name_latin: str
    date_of_birth: str
    breed_ua: str
    breed_en: str
    gender_ua: str
    gender_en: str
    color_ua: str
    color_en: str
    species_ua: str
    species_en: str
    identifier_type_ua: str
    identifier_type_en: str
    owner_passport_number: str
    organization_id: str
    identifier_number: str
    identifier_date: str
    update_datetime: str