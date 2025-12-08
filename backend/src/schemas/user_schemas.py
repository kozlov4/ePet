from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional








class ChangeEmailRequest(BaseModel):
    new_email: EmailStr = Field(min_length=1, max_length=100)


