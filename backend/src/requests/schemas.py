from datetime import date
from pydantic import BaseModel

class RequestCreate(BaseModel):
    pet_id: int

class RequestPetsList(BaseModel):
    pet_id: int
    img_url: str
    pet_name: str
    gender: str
    breed: str
    date_of_birth: date