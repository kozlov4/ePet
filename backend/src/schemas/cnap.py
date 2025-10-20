from pydantic import BaseModel

class OwnerForCNAPResponse(BaseModel):
    passport_number: str | None = None

    class Config:
        from_attributes = True

class AnimalForCNAPResponse(BaseModel):
    species: str
    breed: str
    gender: str
    animal_passport_number: str | None = None
    owner: OwnerForCNAPResponse | None = None

    class Config:
        from_attributes = True