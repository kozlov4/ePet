
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api import users, organization, reset_password, forgot_password


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
app.include_router(reset_password.router)
app.include_router(forgot_password.router)



