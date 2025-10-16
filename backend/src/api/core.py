import os
from datetime import timedelta, datetime, timezone
from passlib.context import CryptContext
from jose import jwt, JWTError


bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')


def create_access_token(subject: str, id: int, expires_delta: timedelta):
    encode = {'sub': subject, 'id': id}
    expires = datetime.now(timezone.utc) + expires_delta
    encode.update({'exp': expires})
    return jwt.encode(encode, os.getenv("SECRET_KEY"), algorithm=os.getenv("ALGORITHM"))