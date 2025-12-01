from pydantic import BaseModel, ConfigDict, field_validator
from typing import List
from datetime import date, datetime

class VaccinationItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    drug_name: str
    series_number: str
    vaccination_date: datetime
    valid_until: datetime

    @field_validator("vaccination_date", "valid_until", mode="before")
    def parse_dates(cls, v):
        if isinstance(v, str):
            # пробуем дд.мм.гггг
            for fmt in ("%d.%m.%Y", "%d.%m.%Y %H:%M"):
                try:
                    return datetime.strptime(v, fmt)
                except ValueError:
                    continue
        return v

class VaccinationsListResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    passport_number: str
    update_datetime: str
    vaccinations: List[VaccinationItem]