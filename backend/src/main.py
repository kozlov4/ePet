
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api import users, organization, reset_password, forgot_password, login


app = FastAPI(
    title="ePet 🐶",
    description="API для роботи з вет клініками цнап та юзерами",
    version="1.0.0"
)


app.include_router(users.router)
app.include_router(organization.router)
app.include_router(reset_password.router)
app.include_router(forgot_password.router)
app.include_router(login.router)




