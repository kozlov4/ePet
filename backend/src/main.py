from fastapi import FastAPI, Depends
from src.db.database import get_db

app = FastAPI()

@app.get("/check-db")
def check_db(db=Depends(get_db)):
    return {"message": "✅ Подключение к БД успешно!"}


@app.get("/test")
def hello():
    return {"message": "hello kozlov"}
