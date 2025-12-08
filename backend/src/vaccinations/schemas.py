from typing import List
from pydantic import BaseModel, Field, field_validator, model_validator
from datetime import datetime, date

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

class CreateVaccination(BaseModel):
    drug_name: str = Field(..., min_length=2, max_length=100, description="Назва препарату")
    series_number: str = Field(..., min_length=2, max_length=50, description="Серія")
    vaccination_date: str = Field(..., description="Дата вакцинації (DD.MM.YYYY)")
    valid_until: str = Field(..., description="Дійсний до (DD.MM.YYYY)")

    @field_validator("drug_name", "series_number")
    @classmethod
    def clean_text(cls, v: str):
        v = v.strip()
        if not v:
            raise ValueError("Поле не може бути порожнім")
        return v

    @field_validator("vaccination_date", "valid_until")
    @classmethod
    def validate_date_format(cls, v: str):
        try:
            datetime.strptime(v, "%d.%m.%Y").date()
            return v
        except ValueError:
            raise ValueError("Невірний формат дати. Використовуйте формат DD.MM.YYYY (наприклад, 12.12.2025)")

    @model_validator(mode="after")
    def check_dates_logic(self):
        try:
            vac_date = datetime.strptime(self.vaccination_date, "%d.%m.%Y").date()
            valid_date = datetime.strptime(self.valid_until, "%d.%m.%Y").date()
        except ValueError:
            return self

        if vac_date > date.today():
            raise ValueError("Дата вакцинації не може бути в майбутньому")

        if valid_date <= vac_date:
            raise ValueError("Дата 'Дійсний до' має бути пізніше дати вакцинації")

        return self