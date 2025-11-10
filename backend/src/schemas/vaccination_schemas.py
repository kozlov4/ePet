from pydantic import BaseModel, ConfigDict

class VaccinationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    passport_number: str
    update_datetime: str
    drug_name: str
    series_number: str
    vaccination_date: str
    valid_until: str
    organization_name: str