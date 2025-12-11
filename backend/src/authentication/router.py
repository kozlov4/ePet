from typing import Annotated
from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from src.db.database import get_db
from src.authentication.schemas import TokenResponse
from src.authentication.service import login_service

router = APIRouter(tags=['Login 🔐'])

db_dependency = Annotated[Session, Depends(get_db)]


@router.post('/login/', response_model=TokenResponse)
async def login_route(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: db_dependency):
    return login_service(db=db, form_data=form_data)