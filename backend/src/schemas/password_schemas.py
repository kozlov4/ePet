from pydantic import BaseModel, EmailStr, Field





class ForgotPasswordPayload(BaseModel):
    email: EmailStr

class ResetPasswordPayload(BaseModel):
    token: str
    new_password:str= Field(min_length=9, max_length=100)