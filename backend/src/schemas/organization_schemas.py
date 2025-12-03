from pydantic import BaseModel, EmailStr, Field
from enum import Enum

class OrgType(str, Enum):
    vetclinic = "Ветклініка"
    shelter = "Притулок"


class OrganizationsForCnap(BaseModel):
  organization_id:int
  organization_name:str
  organization_type:str
  city:str
  street:str
  building:str
  phone_number:str
  email:str


class CreateOrganization(BaseModel):
  organization_name:str = Field(min_length=3, max_length=100)
  organization_type:OrgType
  city:str = Field(min_length=3, max_length=50)
  street:str = Field(min_length=3, max_length=50)
  building:str = Field(min_length=1, max_length=10)
  phone_number:str = Field(min_length=3, max_length=20)
  email:EmailStr

class UpdateOrganization(CreateOrganization):
   pass