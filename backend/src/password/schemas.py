from pydantic import BaseModel, EmailStr, Field, field_validator


class ForgotPasswordPayload(BaseModel):
    email: EmailStr

class ResetPasswordPayload(BaseModel):
    token: str
    new_password:str= Field(min_length=8, max_length=100)

    @field_validator("new_password")
    @classmethod
    def validate_password_strength(cls, v: str):
        if not any(char.isdigit() for char in v):
            raise ValueError("Пароль повинен містити хоча б одну цифру")
        if not any(char.isupper() for char in v):
            raise ValueError("Пароль повинен містити хоча б одну велику літеру")
        if not any(char.islower() for char in v):
            raise ValueError("Пароль повинен містити хоча б одну малу літеру")
        if not any(char in "!@#$%^&*()_+" for char in v):
            raise ValueError("Пароль повинен містити спеціальний символ (!@#$%^&*()_+)")
        return v