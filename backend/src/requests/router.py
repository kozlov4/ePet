from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from typing import Annotated

from src.db.database import get_db
from src.db.models import Requests, Pets
from src.authentication.service import get_current_user
from src.requests.schemas import RequestCreate
from src.requests.service import create_request_service

router = APIRouter(prefix="/requests", tags=["Requests 📝"])

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]


@router.post("/apply", status_code=status.HTTP_201_CREATED)
async def create_request_route(
        request_data: RequestCreate,
        user: user_dependency,
        db: db_dependency
):
    return create_request_service(request_data=request_data, user=user, db=db)
