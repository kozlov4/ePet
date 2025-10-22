from pydantic import BaseModel, EmailStr, Field

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

