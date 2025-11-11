from pydantic import BaseModel, ConfigDict
from typing import List

class VaccinationItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    drug_name: str
    series_number: str
    vaccination_date: str
    valid_until: str
    organization_name: str

class VaccinationsListResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    passport_number: str
    update_datetime: str
    vaccinations: List[VaccinationItem]