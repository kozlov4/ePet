from pydantic import BaseModel, ConfigDict
from typing import List, Optional

class VaccinationItem(BaseModel):
    drug_name: str
    series_number: str
    vaccination_date: str
    valid_until: str
    organization_name: str

class VaccinationsListResponse(BaseModel):
    passport_number: str
    update_datetime: str
    vaccinations: List[VaccinationItem]