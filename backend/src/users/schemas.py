import re
from pydantic import BaseModel, Field, EmailStr, field_validator
from enum import Enum

class SupportedCities(str, Enum):
    KYIV = "Київ"
    KHARKIV = "Харків"
    ODESA = "Одеса"
    DNIPRO = "Дніпро"
    DONETSK = "Донецьк"
    ZAPORIZHZHIA = "Запоріжжя"
    LVIV = "Львів"
    KRYVYI_RIH = "Кривий Ріг"
    MYKOLAIV = "Миколаїв"
    MARIUPOL = "Маріуполь"
    LUHANSK = "Луганськ"
    VINNYTSIA = "Вінниця"
    MAKIIVKA = "Макіївка"
    SEVASTOPOL = "Севастополь"
    SIMFEROPOL = "Сімферополь"
    KHERSON = "Херсон"
    POLTAVA = "Полтава"
    CHERNIHIV = "Чернігів"
    CHERKASY = "Черкаси"
    KHMELNYTSKYI = "Хмельницький"
    ZHYTOMYR = "Житомир"
    CHERNIVTSI = "Чернівці"
    SUMY = "Суми"
    RIVNE = "Рівне"
    IVANO_FRANKIVSK = "Івано-Франківськ"
    KAMIANSKE = "Кам'янське"
    KROPYVNYTSKYI = "Кропивницький"
    TERNOPIL = "Тернопіль"
    KREMENCHUK = "Кременчук"
    LUTSK = "Луцьк"
    BILA_TSERKVA = "Біла Церква"
    UZHHOROD = "Ужгород"
    NIKOPOL = "Нікополь"
    SLOVIANSK = "Слов'янськ"
    BERDIANSK = "Бердянськ"
    PAVLOHRAD = "Павлоград"
    BROVARY = "Бровари"
    UMAN = "Умань"
    MUKACHEVO = "Мукачево"


class UserRegistrationRequest(BaseModel):
    last_name: str = Field(min_length=2, max_length=100)
    first_name: str = Field(min_length=2, max_length=100)
    patronymic: str = Field(min_length=2, max_length=100)
    passport_number: str = Field(pattern=r"^([А-ЯІЇЄ]{2}\d{6}|\d{9})$")
    city: SupportedCities
    street: str = Field(min_length=3, max_length=100)
    house_number: str = Field(min_length=1, max_length=10)
    postal_index: str = Field(pattern=r"^\d{5}$")
    email: EmailStr = Field(min_length=5, max_length=100)
    password: str = Field(min_length=8, max_length=100)

    @field_validator("last_name", "first_name", "patronymic")
    @classmethod
    def validate_ukrainian_names(cls, v: str):
        if not re.match(r"^[А-Яа-яІіЇїЄєҐґ\-\s\']+$", v):
            raise ValueError("Ім'я повинно містити тільки кирилицю, дефіс або апостроф")
        return v.title()

    @field_validator("passport_number")
    @classmethod
    def validate_passport_upper(cls, v: str):
        return v.upper()

    @field_validator("postal_index")
    @classmethod
    def validate_postal_index(cls, v: str):
        if not v.isdigit():
            raise ValueError("Поштовий індекс повинен містити тільки цифри")
        return v

    @field_validator("password")
    @classmethod
    def validate_password_strength(cls, v: str):
        if not any(char.isdigit() for char in v):
            raise ValueError("Пароль повинен містити хоча б одну цифру")
        if not any(char.isupper() for char in v):
            raise ValueError("Пароль повинен містити хоча б одну велику літеру")
        if not any(char.islower() for char in v):
            raise ValueError("Пароль повинен містити хоча б одну малу літеру")
        if not any(char in "!@#$%^&*()_+" for char in v):
            raise ValueError("Пароль повинен містити спеціальний символ (!@#$%^&*()_+)")
        return v

    @classmethod
    def list(cls):
        return list(map(lambda c: c.value, cls))

    @field_validator("house_number")
    @classmethod
    def validate_house_number(cls, v: str):
        if not any(char.isdigit() for char in v):
            raise ValueError("Номер будинку повинен містити цифру")

        if not re.match(r"^[0-9а-яА-Яa-zA-Z\-\/]+$", v):
            raise ValueError("Номер будинку містить недопустимі символи")

        return v.upper()