import os

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from src.api import users, organization, reset_password, forgot_password, login, pets


app = FastAPI(
    title="ePet 🐶",
    description="API для роботи з вет клініками цнап та юзерами",
    version="1.0.0"
)

#uploads_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
#app.mount("/uploads", StaticFiles(directory=uploads_path), name="uploads")

#app.mount("/uploads", StaticFiles(directory="/root/project/uploads"), name="uploads")
app.mount("/uploads", StaticFiles(directory="/home/hapy/uploads"), name="uploads")

origins = [
    "http://localhost:3000", 
    "https://upcity.live",    
    "https://www.upcity.live",
    "https://e-pet-seven.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,     
    allow_credentials=True,   
    allow_methods=["*"],       
    allow_headers=["*"],       
)

app.include_router(users.router)
app.include_router(organization.router)
app.include_router(reset_password.router)
app.include_router(forgot_password.router)
app.include_router(login.router)
app.include_router(pets.router)



