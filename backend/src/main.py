from typing import Annotated
from fastapi import FastAPI, Depends
from src.db.database import get_db
from src.db.models import Users
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

db_dependency = Annotated[Session, Depends(get_db)]

app = FastAPI(
    title="ePet 🐶",
    description="API для роботи з вет клініками цнап та юзерами",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)



@app.get('/extracts/')
async def read_extracts(db:db_dependency):
    users_model = db.query(Users).all()
    return users_model