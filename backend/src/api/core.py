import os
from datetime import timedelta, datetime, timezone
from typing import Annotated
from fastapi import Depends, HTTPException
from passlib.context import CryptContext
from jose import jwt, JWTError
from starlette import status
from fastapi.security import OAuth2PasswordBearer


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
