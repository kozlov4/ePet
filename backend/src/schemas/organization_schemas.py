from pydantic import BaseModel, EmailStr, Field

class OrganizationsForCnap(BaseModel):
  organization_id:int
  organization_name:str
  organization_type:str
  city:str
  street:str
  building:str
  phone_number:str
  email:str
