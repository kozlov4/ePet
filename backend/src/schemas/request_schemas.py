from pydantic import BaseModel

class RequestCreate(BaseModel):
    pet_id: int