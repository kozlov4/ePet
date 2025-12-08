import os
from jose import jwt, JWTError
from typing import Annotated
from starlette import status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from src.db.database import get_db
from src.db.models import Organizations, Users, Cnap
from datetime import timedelta, datetime, timezone
from fastapi import Depends, HTTPException
from passlib.context import CryptContext


db_dependency = Annotated[Session, Depends(get_db)]
bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
oauth2_bearer = OAuth2PasswordBearer(tokenUrl="/login/")


def create_access_token(subject: str, id: int, expires_delta: timedelta):
    encode = {'sub': subject, 'id': id}
    expires = datetime.now(timezone.utc) + expires_delta
    encode.update({'exp': expires})
    return jwt.encode(encode, os.getenv("SECRET_KEY"), algorithm=os.getenv("ALGORITHM"))


async def get_current_user(token: Annotated[str, Depends(oauth2_bearer)]):
    try:
        payload = jwt.decode(token, os.getenv("SECRET_KEY"), algorithms=[os.getenv("ALGORITHM")])
        username: str = payload.get('sub')
        user_id: int = payload.get('id')
        if username is None or user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Could not validate user')
        return {'username': username, 'user_id': user_id}
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Could not validate user')


def login_service(db:Session, form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    org = db.query(Organizations).filter(Organizations.email == form_data.username).first()
    cnap = db.query(Cnap).filter(Cnap.email == form_data.username).first()

    if org:
        user_model = org
        name = org.organization_name
        user_id = org.organization_id
        role = org.organization_type
    elif cnap:
        user_model = cnap
        name = cnap.name
        user_id = cnap.cnap_id
        role = "ЦНАП"

    else:
        user = db.query(Users).filter(Users.email == form_data.username).first()
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Користувача не знайдено")
        user_model = user
        name = user.first_name
        user_id = user.user_id
        role = None

    if not bcrypt_context.verify(form_data.password, user_model.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Неправильний пароль")

    token = create_access_token(
        subject=user_model.email,
        id=user_id,
        expires_delta=timedelta(minutes=30),

    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "user_name": name,
        "organization_type": role
    }




