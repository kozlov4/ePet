from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional

class UserResponse(BaseModel):
  user_id:int
  last_name:str
  first_name:str
  patronymic:str
  passport_number:str
  postal_index:str
  email:str

class UserCreateRequest(BaseModel):
    last_name:str = Field(min_length=3, max_length=100)
    first_name:str = Field(min_length=3, max_length=100)
    patronymic:str = Field(min_length=3, max_length=100)
    passport_number:str = Field(min_length=3, max_length=20)
    city: str = Field(min_length=2, max_length=50)
    street: str = Field(min_length=3, max_length=100)
    house_number: str = Field(min_length=1, max_length=20)
    postal_index:str = Field(min_length=1, max_length=10)
    email:EmailStr = Field(min_length=1, max_length=100)
    password:str = Field(min_length=8, max_length=100)

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