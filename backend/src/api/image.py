import os
import shutil
import uuid
from datetime import datetime
from src.db.database import get_db
from fastapi import HTTPException, UploadFile
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

load_dotenv()

UPLOAD_DIR = f"{os.getenv('UPLOAD_DIR')}"
BASE_URL = f"{os.getenv('BASE_URL')}"

def upload_image(file: UploadFile) -> str:
    if not file.filename.lower().endswith((".jpg", ".jpeg", ".png", ".gif")):
        raise HTTPException(status_code=400, detail="Непідтримуваний формат файлу")

    filename = f"{uuid.uuid4().hex}_{file.filename}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # возвращаем именно строку, а не словарь
    return f"{BASE_URL}/{filename}"

