from pydantic import BaseModel

class ReportRequest(BaseModel):
    pet_id: int
    name_document: str