
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from src.api import users, organization
from src.api import users, organization, cnap 


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

app.include_router(users.router)
app.include_router(organization.router)
app.include_router(cnap.router)


