import os
from datetime import timedelta, datetime, timezone
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import jwt, JWTError
from src.db.database import get_db
from src.db.models import Organizations
from src.schemas.token import TokenResponse


router = APIRouter(tags=['Organizations 🏢'], prefix="/organizations")
db_dependency = Annotated[Session, Depends(get_db)]
bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')


def create_access_token(email: str, org_id: int, expires_delta: timedelta):
    encode = {'sub': email, 'id': org_id}
    expires = datetime.now(timezone.utc) + expires_delta
    encode.update({'exp': expires})
    return jwt.encode(encode, os.getenv("SECRET_KEY"), algorithm=os.getenv("ALGORITHM"))



@router.post('/login', response_model=TokenResponse)
async def login_for_organization(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: db_dependency):
    
    organization = db.query(Organizations).filter(Organizations.email == form_data.username).first()
    
    if not organization:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Organization not found.")

    if not bcrypt_context.verify(form_data.password, organization.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect password.")

    token = create_access_token(
        email=organization.email, 
        org_id=organization.organization_id, 
        expires_delta=timedelta(minutes=30) 
    )

    return {"access_token": token, "token_type": "bearer"}