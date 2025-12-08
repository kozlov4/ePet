import os
from datetime import datetime
from random import randint
import shutil
import uuid
from dotenv import load_dotenv
from deep_translator import GoogleTranslator
from fastapi import  Depends, HTTPException,  UploadFile
from fastapi.encoders import jsonable_encoder
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload
from typing import Union

from starlette import status
from src.utils.email_utils import send_report_email
from src.utils.pdf_generator import create_identification_pdf, create_vaccination_pdf, create_general_pdf
from src.db.database import get_db
from src.db.models import Pets, Organizations, Cnap, Passports, Identifiers, Users
from typing import Annotated
from src.authentication.service import get_current_user
from src.pets.schemas import PetCreateForm, ReadPetForCnap, ReadPetForLintel, ReadPetForUser, ReadPetForVeterinary, PetUpdateRequest, ReportRequest
from src.organizations.service import get_current_org_or_cnap
from src.db.models import Vaccinations, Extracts

load_dotenv()

UPLOAD_DIR = f"{os.getenv('UPLOAD_DIR')}"
BASE_URL = f"{os.getenv('BASE_URL')}"

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]


def upload_image(file: UploadFile) -> str:
    if not file.filename.lower().endswith((".jpg", ".jpeg", ".png", ".gif")):
        raise HTTPException(status_code=400, detail="Непідтримуваний формат файлу")

    filename = f"{uuid.uuid4().hex}_{file.filename}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return f"{BASE_URL}/{filename}"



def format_value(value, default="—"):
    if value is None or value == "":
        return default
    return str(value)


def check_gender(gender):
    if gender == "Ж":
        return "F"
    elif gender == "Ч":
        return "M"


def generate_passport_number(db) -> str:
    while True:
        number = randint(1000, 999999)
        passport_number = f"UA-AA-{number:06d}"
        exists = db.query(Passports).filter(
            Passports.passport_number == passport_number).first()
        if not exists:
            return passport_number


def add_pet_service(db:Session, file:UploadFile, form_data:PetCreateForm, org: Annotated[Union[Organizations, Cnap, None], Depends(get_current_org_or_cnap)] = None):
    if org is None:
        raise HTTPException(status_code=403, detail="Недостатньо прав для додавання тварини")

    if isinstance(org, Cnap):
        org_type = "ЦНАП"
        org_id = org.cnap_id
    elif isinstance(org, Organizations):
        org_type = org.organization_type
        org_id = org.organization_id
        if org_type == "Ветклініка":
            raise HTTPException(status_code=403, detail="Ветклініка не може додавати тварин")

    user_id = None
    passport_number = None

    if org_type == "ЦНАП":
        if not form_data.owner_passport_number:
            raise HTTPException(status_code=400, detail="Потрібно вказати паспорт власника")

        user = db.query(Users).filter(Users.passport_number == form_data.owner_passport_number).first()
        if not user:
            raise HTTPException(status_code=404, detail="Власника з таким паспортом не знайдено")

        user_id = user.user_id

        if not (form_data.identifier_type and form_data.identifier_number and form_data.chip_date):
            raise HTTPException(
                status_code=400,
                detail="Для реєстрації в ЦНАП необхідно заповнити дані про чип"
            )

        passport_number = generate_passport_number(db)

        existing_identifier = db.query(Identifiers).filter(
            Identifiers.identifier_number == form_data.identifier_number
        ).first()
        if existing_identifier:
            raise HTTPException(status_code=400, detail=f"Чіп {form_data.identifier_number} вже існує")

    img_url: str = upload_image(file)

    new_pet = Pets(
        img_url=img_url,
        pet_name=form_data.pet_name,
        species=form_data.species,
        breed=form_data.breed,
        gender=form_data.gender,
        date_of_birth=form_data.date_of_birth,
        color=form_data.color,
        organization_id=org_id,
        user_id=user_id,
        sterilization=False
    )

    db.add(new_pet)
    db.commit()
    db.refresh(new_pet)

    if org_type == "ЦНАП":
        identifier = Identifiers(
            identifier_number=form_data.identifier_number,
            identifier_type=form_data.identifier_type,
            date=form_data.chip_date,
            cnap_id=org_id,
            pet_id=new_pet.pet_id
        )
        db.add(identifier)

        passport = Passports(
            passport_number=passport_number,
            pet_id=new_pet.pet_id,
            cnap_id=org_id
        )
        db.add(passport)

        db.commit()

    response = {
        "message": "Тварину успішно додано",
        "pet_id": new_pet.pet_id,
        "img_url": img_url,
        "registered_by": org_type,
        "details": {
            "name": new_pet.pet_name,
            "species": new_pet.species,
            "breed": new_pet.breed,
            "gender": new_pet.gender,
            "color": new_pet.color,
            "date_of_birth": new_pet.date_of_birth.isoformat() if new_pet.date_of_birth else None,
        }
    }

    if org_type == "ЦНАП":
        response["chip"] = {
            "identifier_number": form_data.identifier_number,
            "identifier_type": form_data.identifier_type,
            "chip_date": form_data.chip_date.isoformat() if form_data.chip_date else None
        }
        response["passport"] = passport_number

    return jsonable_encoder(response)


def read_pet_information_service(pet_id: int, db: Session, organization_user: Annotated[Union[Organizations, Cnap, None], Depends(get_current_org_or_cnap)], user_id:int):
    pet = db.query(Pets).filter(Pets.pet_id == pet_id).first()
    if not pet:
        raise HTTPException(status_code=404, detail="Тваринку не знайдено")

    org_type = None
    current_org_id = None

    if isinstance(organization_user, Organizations):
        org_type = organization_user.organization_type
        current_org_id = organization_user.organization_id
    elif isinstance(organization_user, Cnap):
        org_type = "ЦНАП"
        current_org_id = organization_user.cnap_id


    if org_type == "Притулок" and pet.organization_id != current_org_id:
        raise HTTPException(status_code=403, detail="Ви не можете переглядати чужих тварин")

    if not org_type and not user_id:
        raise HTTPException(status_code=403, detail="Немає доступу")

    translator = GoogleTranslator(source='auto', target='en')

    def translate(text: str):
        return translator.translate(text) if text else "—"

    def fmt_date(d):
        return d.strftime('%d.%m.%Y') if d else "—"

    def safe_str(val):
        return str(val) if val else "—"

    base_data = {
        "pet_id": pet.pet_id,
        "passport_number": safe_str(pet.passport.passport_number) if pet.passport else "—",
        "img_url": pet.img_url,
        "pet_name": pet.pet_name,
        "pet_name_en": translate(pet.pet_name),
        "date_of_birth": fmt_date(pet.date_of_birth),
        "breed": pet.breed,
        "breed_en": translate(pet.breed),
        "gender": pet.gender,
        "gender_en": translate(check_gender(pet.gender)),
        "color": pet.color,
        "color_en": translate(pet.color),
        "species": pet.species,
        "species_en": translate(pet.species),
    }

    if org_type == "Притулок":
        return ReadPetForLintel(**base_data)

    identifier = pet.identifiers[0] if pet.identifiers else None

    extended_data = {
        **base_data,
        "organization_id": pet.organization_id,
        "date": fmt_date(identifier.date) if identifier else "—",
        "identifier_type": safe_str(identifier.identifier_type) if identifier else "—",
        "identifier_type_en": translate(identifier.identifier_type) if identifier else "—",
        "identifier_number": safe_str(identifier.identifier_number) if identifier else "—",
        "owner_passport_number": safe_str(pet.owner.passport_number) if pet.owner else "—",
    }

    if org_type == "Ветклініка":
        return ReadPetForVeterinary(**extended_data)

    elif org_type == "ЦНАП":
        return ReadPetForCnap(**extended_data)

    elif user_id is not None:
        return ReadPetForUser(
            **extended_data,
            update_datetime=datetime.now().strftime('%d.%m.%Y')
        )

    raise HTTPException(status_code=403, detail="Невідомий тип доступу")


def get_pet_vaccinations_service(pet_id:int, db:Session,
                                 organization_user: Annotated[Union[Organizations, Cnap, None], Depends(get_current_org_or_cnap)],
                                 user:user_dependency):
    pet = db.query(Pets).filter(Pets.pet_id == pet_id).first()

    if not pet:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Тваринка з id {pet_id} не знайдена"
        )

    org_type = None

    if isinstance(organization_user, Organizations):
        org_type = organization_user.organization_type
    elif isinstance(organization_user, Cnap):
        org_type = "ЦНАП"

    is_vet = (org_type == "Ветклініка")
    is_user = (user is not None)

    if not is_vet and not is_user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Доступ має лише ветклініка або авторизований користувач"
        )

    query = (
        select(Vaccinations)
        .where(Vaccinations.pet_id == pet_id)
        .options(joinedload(Vaccinations.organization))
        .order_by(Vaccinations.vaccination_date.desc())
    )

    result = db.execute(query)
    vaccinations_from_db = result.scalars().all()

    vaccination_items = []

    def safe_str(val):
        return str(val) if val else "—"

    for vac in vaccinations_from_db:
        org_name = vac.organization.organization_name if vac.organization else "—"

        item = {
            "drug_name": safe_str(vac.drug_name),
            "series_number": safe_str(vac.series_number),
            "vaccination_date": vac.vaccination_date.strftime('%d.%m.%Y') if vac.vaccination_date else "—",
            "valid_until": vac.valid_until.strftime('%d.%m.%Y') if vac.valid_until else "—",
            "organization_name": safe_str(org_name)
        }
        vaccination_items.append(item)

    return {
        "passport_number": safe_str(pet.passport.passport_number if pet.passport else None),
        "update_datetime": datetime.now().strftime('%d.%m.%Y'),
        "vaccinations": vaccination_items
    }


def update_pet_service(pet_id:int, db:Session, data:PetUpdateRequest, actor: Annotated[Union[Organizations, Cnap, None], Depends(get_current_org_or_cnap)] = None):
    pet = db.query(Pets).filter(Pets.pet_id == pet_id).first()
    if not pet:
        raise HTTPException(status_code=404, detail="Тваринку не знайдено")


    if actor is None or isinstance(actor, Cnap):
        raise HTTPException(status_code=403, detail="Доступ заборонено. Тільки для притулків.")

    if isinstance(actor, Organizations):
        if actor.organization_type != "Притулок":
            raise HTTPException(status_code=403, detail="Лише притулок може редагувати дані")

        if pet.organization_id != actor.organization_id:
            raise HTTPException(status_code=403, detail="Ви можете редагувати лише власні тварини")

    allowed_fields = [
        "pet_name", "gender", "breed", "species",
        "color", "date_of_birth"
    ]

    updated_fields = []

    for field in allowed_fields:
        value = getattr(data, field)
        if value is not None:
            setattr(pet, field, value)
            updated_fields.append(field)

    if not updated_fields:
        return {
            "message": "Змін не виявлено",
            "updated_fields": []
        }

    try:
        db.commit()
        db.refresh(pet)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Помилка при збереженні даних")

    return {
        "message": "Дані тварини оновлено",
        "updated_fields": updated_fields
    }


async def generate_report_service(request:ReportRequest, user:user_dependency, db:Session):
    pet = db.query(Pets).options(
        joinedload(Pets.owner),
        joinedload(Pets.identifiers),
        joinedload(Pets.passport).joinedload(Passports.organization),
        joinedload(Pets.organization),
        joinedload(Pets.vaccinations).joinedload(Vaccinations.organization)
    ).filter(Pets.pet_id == request.pet_id).first()

    if not pet:
        raise HTTPException(status_code=404, detail="Тваринку не знайдено")
    if pet.user_id != user.get('user_id'):
        raise HTTPException(status_code=403, detail="Ви не є власником")

    pdf_bytes = None
    filename = "Report.pdf"


    if request.name_document == "Офіційний витяг про ідентифікаційні дані тварини":
        if not pet.identifiers:
            raise HTTPException(
                status_code=400, detail="У тварини відсутній ідентифікатор")

        identifier = pet.identifiers[-1]
        cnap_org = identifier.cnap

        pdf_context = {
            "creation_date": datetime.now().strftime("%d.%m.%Y"),
            "passport_id": f"{pet.passport.passport_number}" if pet.passport else "Паспорт не оформлено",
            "pet_name": pet.pet_name,
            "species": pet.species,
            "breed": pet.breed,
            "identifier_db_id": f"ID запису: {identifier.identifier_id}",
            "identifier_number": identifier.identifier_number,
            "identifier_type": identifier.identifier_type,
            "identifier_date": identifier.date.strftime("%d.%m.%Y") if identifier.date else "—",
            "cnap": {
                "name": cnap_org.name if cnap_org else "Невідомо",
                "city": cnap_org.city if cnap_org else "",
                "street": cnap_org.street if cnap_org else "",
                "phone_number": cnap_org.phone_number if cnap_org else "—"
            }
        }
        pdf_bytes = create_identification_pdf(pdf_context)
        filename = f"Identification_{pet.pet_id}.pdf"

    elif request.name_document == "Медичний витяг про проведені щеплення тварини":
        if not pet.vaccinations:
            raise HTTPException(
                status_code=400, detail="У тварини немає записів про вакцинацію")

        vac_list = []
        for vac in pet.vaccinations:
            vac_list.append({
                "manufacturer": vac.manufacturer,
                "drug_name": vac.drug_name,
                "series_number": vac.series_number,
                "vaccination_date": vac.vaccination_date.strftime("%d.%m.%Y"),
                "valid_until": vac.valid_until.strftime("%d.%m.%Y"),
                "organization_name": vac.organization.organization_name if vac.organization else "Невідомо"
            })

        pdf_context = {
            "creation_date": datetime.now().strftime("%d.%m.%Y"),
            "passport_id": f"{pet.passport.passport_number}" if pet.passport else "Паспорт не оформлено",
            "pet_name": pet.pet_name,
            "species": pet.species,
            "breed": pet.breed,
            "vaccinations": vac_list
        }
        pdf_bytes = create_vaccination_pdf(pdf_context)
        filename = f"Vaccination_{pet.pet_id}.pdf"

    elif request.name_document == "Витяг з реєстру домашніх тварин":
        gender_ua = "Самець" if pet.gender in ["M", "Ч", "Male"] else "Самка"
        steril_ua = "Стерилізований(а)" if pet.sterilization else "Не стерилізований(а)"

        owner_addr = f"{pet.owner.city}, {pet.owner.street}"
        if pet.owner.house_number:
            owner_addr += f", буд. {pet.owner.house_number}"

        reg_cnap = None
        if pet.passport and pet.passport.organization:
            reg_cnap = pet.passport.organization

        org_addr_str = "—"
        org_name_str = "Невідомо"

        if reg_cnap:
            org_name_str = reg_cnap.name
            org_addr_str = f"{reg_cnap.city}, {reg_cnap.street}"
            if reg_cnap.building:
                org_addr_str += f", {reg_cnap.building}"

        pdf_context = {
            "creation_date": datetime.now().strftime("%d.%m.%Y"),
            "passport_id": f"{pet.passport.passport_number}" if pet.passport else "Паспорт не оформлено",

            "pet_name": pet.pet_name,
            "date_of_birth": pet.date_of_birth.strftime("%d.%m.%Y"),
            "breed": pet.breed,
            "gender": gender_ua,
            "color": pet.color,
            "species": pet.species,
            "sterilisation": steril_ua,

            "owner_name": f"{pet.owner.last_name} {pet.owner.first_name} {pet.owner.patronymic}",
            "owner_address": owner_addr,

            "org_name": org_name_str,
            "org_address": org_addr_str
        }

        pdf_bytes = create_general_pdf(pdf_context, pet.img_url)
        filename = f"Registry_Extract_{pet.pet_id}.pdf"

    else:
        raise HTTPException(
            status_code=400, detail="Тип документа не підтримується")

    try:
        await send_report_email(
            to_email=pet.owner.email,
            pdf_bytes=pdf_bytes,
            filename=filename
        )

        new_extract = Extracts(
            extract_date=datetime.now(),
            extract_name=request.name_document,
            pet_id=pet.pet_id
        )
        db.add(new_extract)
        db.commit()

    except Exception as e:
        print(f"Error generating/sending report: {e}")
        db.rollback()
        raise HTTPException(
            status_code=500, detail="Помилка при формуванні або відправці звіту")

    return {"detail": "Витяг створено успішно та надіслано на вашу пошту"}


def delete_pet_service(pet_id:int, org_or_cnap:Annotated[Organizations | Cnap, Depends(get_current_org_or_cnap)], db:Session):
    if isinstance(org_or_cnap, Organizations):
        org_type = org_or_cnap.organization_type
        org_id = org_or_cnap.organization_id
    elif isinstance(org_or_cnap, Cnap):
        org_type = "ЦНАП"
        org_id = None
    else:
        raise HTTPException(status_code=403, detail="Недостатньо прав")

    pet = db.query(Pets).filter(Pets.pet_id == pet_id).first()
    if not pet:
        raise HTTPException(status_code=404, detail="Тваринку не знайдено")

    if org_type == "Ветклініка":
        raise HTTPException(
            status_code=403, detail="Недостатньо прав для видалення")

    if org_type == "Притулок" and pet.organization_id != org_id:
        raise HTTPException(
            status_code=403, detail="Недостатньо прав для видалення")

    db.delete(pet)
    db.commit()

    return {"message": "Тваринку успішно видалено"}

