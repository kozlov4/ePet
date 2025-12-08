from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional


class UserResponse(BaseModel):
    user_id: int
    last_name: str
    first_name: str
    patronymic: str | None = None
    passport_number: str | None = None
    full_address: str
    postal_index: str | None = None
    email: str

    class Config:
        from_attributes = True



class UserPetItem(BaseModel):
    pet_id: str
    img_url:str
    passport_number: str
    pet_name_ua: str
    pet_name_en: str
    date_of_birth: str
    update_datetime: str

class ChangeEmailRequest(BaseModel):
    new_email: EmailStr = Field(min_length=1, max_length=100)


class UpdateProfileRequest(BaseModel):
    new_email: Optional[EmailStr] = Field(None, min_length=1, max_length=100)
    old_password: Optional[str] = Field(None, min_length=8, max_length=100)
    new_password: Optional[str] = Field(None, min_length=8, max_length=100)