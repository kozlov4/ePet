import aiosmtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from fastapi import APIRouter, Depends, HTTPException
from typing import Annotated
from datetime import timedelta
from src.schemas.user import UserResponse, UserCreateRequest
from src.schemas.token import TokenResponse
from sqlalchemy.orm import Session
from starlette import status
from src.db.database import get_db
from src.db.models import Users
from fastapi.security import OAuth2PasswordRequestForm
from passlib.context import CryptContext
from src.api.core import create_access_token, bcrypt_context


router = APIRouter(tags=['Users 🧑‍🦱'], prefix="/users")

db_dependency = Annotated[Session, Depends(get_db)]


@router.post('/register/', status_code=status.HTTP_201_CREATED, response_model=TokenResponse)
async def create_user(db: db_dependency, create_user_request: UserCreateRequest):
    existing_user = db.query(Users).filter(Users.email == create_user_request.email).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already in use.")

    create_user_model = Users(
        last_name=create_user_request.last_name,
        first_name=create_user_request.first_name,
        patronymic=create_user_request.patronymic,
        passport_number=create_user_request.passport_number,
        
        city=create_user_request.city,
        street=create_user_request.street,
        house_number=create_user_request.house_number,
        
        postal_index=create_user_request.postal_index,
        email=create_user_request.email,
        password=bcrypt_context.hash(create_user_request.password)
    )
    
    db.add(create_user_model)
    db.commit()
    db.refresh(create_user_model)


    token = create_access_token(
        subject=create_user_model.email,
        id=create_user_model.user_id,
        expires_delta=timedelta(minutes=30)
    )

    return {
        "access_token": token, 
        "token_type": "bearer", 
        "user_name": create_user_model.first_name
    } 

# Endpoint для скидання пароля
@router.post("/forgot-password/")
async def forgot_password(email: str, db: db_dependency):
    user = db.query(Users).filter(Users.email == email).first()
    if user:
        reset_token = generate_reset_token()
        user.reset_token = reset_token
        db.commit()

        reset_link = f"https://frontend.com/reset-password?user={user.email}&token={reset_token}"
        
        await send_email(
            to=user.email,
            subject="Скидання пароля",
            body=f"Натисніть на посилання, щоб скинути пароль:\n{reset_link}"
        )

    return {"msg": "Якщо електронна адреса існує, посилання для скидання паролю було надіслано на пошту."}

# Функція для email з посиланням на скидання пароля
async def send_email(to: str, subject: str, body: str):
    smtp_host = "smtp.gmail.com"
    smtp_port = 587
    smtp_user = "email@gmail.com"       
    smtp_password = "app_password"      

    msg = MIMEMultipart()
    msg["From"] = smtp_user
    msg["To"] = to
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain"))

    try:
        await aiosmtplib.send(
            msg,
            hostname=smtp_host,
            port=smtp_port,
            start_tls=True,
            username=smtp_user,
            password=smtp_password,
        )
        print(f"Лист надіслано на {to}")
    except Exception as e:
        print(f"Помилка при надсиланні email: {e}")

#Endpoint для зміни пароля
@router.post("/reset-password/")
async def reset_password(token: str, new_password: str, db: db_dependency):
    
    user = db.query(Users).filter(Users.reset_token == token).first()
    if not user:
        return {"msg": "Неправильний або використаний токен."}

    # Перевірка прострочення токена (1 година)
    if datetime.utcnow() - user.reset_token_created_at > timedelta(hours=1):
        return {"msg": "Токен прострочено. Створіть новий запит на скидання пароля."}

    # Хешування нового пароля
    user.password = bcrypt_context.hash(new_password)
    user.reset_token = None
    user.reset_token_created_at = None
    db.commit()

    return {"msg": "Пароль успішно змінено."}
