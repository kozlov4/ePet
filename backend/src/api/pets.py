from random import randint
from enum import Enum
from fastapi import APIRouter, Depends, HTTPException, status,  UploadFile, Form
from sqlalchemy.orm import Session, joinedload
from typing import Union
from sqlalchemy.future import select
from deep_translator import GoogleTranslator
from datetime import datetime, date
from src.api.image import upload_image
from src.db.database import get_db
from src.schemas.vaccination_schemas import VaccinationsListResponse
from src.db.models import Pets, Vaccinations, Organizations, Cnap, Passports, Identifiers, Users
from typing import Annotated
from src.api.core import  get_current_user
from src.api.organization import   get_current_org_or_cnap
from src.schemas.pet_schemas import AnimaForCnap, AnimaForlLintel, AnimalForVeterinary, AnimalForUser
from src.schemas.report_schemas import ReportRequest 
from src.utils.email_utils import send_report_email
from src.utils.pdf_generator import create_identification_pdf 

router = APIRouter(prefix="/pets", tags=["Pets 🐶"])
db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

def format_value(value, default="—"):
    if value is None or value == "":
        return default
    return str(value)

def check_gender(gender):
    if gender == "Ж":
        return "F"
    elif gender == "Ч":
        return "M"
    

@router.get("/{pet_id}")
async def get_pet_info(
    pet_id: int,
    db: db_dependency,
    organization_user: Annotated[Union[Organizations, Cnap, None], Depends(get_current_org_or_cnap)],
    user: user_dependency
):
    pet = db.query(Pets).filter(Pets.pet_id == pet_id).first()
    org_id = pet.organization_id
    if pet is None:
        raise HTTPException(status_code=404, detail="Тваринку не знайдено")

    passport = pet.passport
    organization = passport.organization if passport else None
    identifier = pet.identifiers[0] if pet.identifiers else None
    translation = GoogleTranslator(source='auto', target='en')

    if isinstance(organization_user, Organizations):
        org_type = organization_user.organization_type
    elif isinstance(organization_user, Cnap):
        org_type = "ЦНАП"
    else:
        org_type = None


    user_id = user.get('user_id')

    if org_type == "Притулок":
        return AnimaForlLintel(
            pet_id=pet.pet_id,
            passport_number=passport.passport_number if passport else "—",
            img_url=pet.img_url,
            pet_name=pet.pet_name,
            pet_name_en=translation.translate(pet.pet_name),
            date_of_birth=pet.date_of_birth,
            breed=pet.breed,
            breed_en=translation.translate(pet.breed),
            gender=pet.gender,
            gender_en=translation.translate(check_gender(pet.gender)),
            color=pet.color,
            color_en=translation.translate(pet.color),
            species=pet.species,
            species_en=translation.translate(pet.species)
        )

    elif org_type == "Ветклініка":
        return AnimalForVeterinary(
            pet_id=pet.pet_id,
            passport_number=passport.passport_number if passport else "—",
            img_url=pet.img_url,
            pet_name=pet.pet_name,
            pet_name_en=translation.translate(pet.pet_name),
            date_of_birth=pet.date_of_birth,
            breed=pet.breed,
            breed_en=translation.translate(pet.breed),
            gender=pet.gender,
            gender_en=translation.translate(check_gender(pet.gender)),
            color=pet.color,
            color_en=translation.translate(pet.color),
            species=pet.species,
            species_en=translation.translate(pet.species),
            organization_id=org_id,
            date=identifier.date if identifier else None,
            identifier_type=identifier.identifier_type if identifier else "—",
            identifier_type_en=translation.translate(identifier.identifier_type) if identifier else "—",
            identifier_number=identifier.identifier_number if identifier else "—",
            owner_passport_number=pet.owner.passport_number if pet.owner else "—",
        )

    elif org_type == "ЦНАП":
        return AnimaForCnap(
            pet_id=pet.pet_id,
            passport_number=passport.passport_number if passport else "—",
            img_url=pet.img_url,
            pet_name=pet.pet_name,
            pet_name_en=translation.translate(pet.pet_name),
            date_of_birth=pet.date_of_birth,
            breed=pet.breed,
            breed_en=translation.translate(pet.breed),
            gender=pet.gender,
            gender_en=translation.translate(check_gender(pet.gender)),
            color=pet.color,
            color_en=translation.translate(pet.color),
            species=pet.species,
            species_en=translation.translate(pet.species),
            organization_id=org_id,  
            date=identifier.date if identifier else None,
            identifier_type=identifier.identifier_type if identifier else "—",
            identifier_type_en=translation.translate(identifier.identifier_type) if identifier else "—",
            identifier_number=identifier.identifier_number if identifier else "—",
            owner_passport_number=pet.owner.passport_number if pet.owner else "—",
        )

    elif org_type is None and user_id is not None:
        return AnimalForUser(
            pet_id=pet.pet_id,
            passport_number=passport.passport_number if passport else "—",
            img_url=pet.img_url,
            pet_name=pet.pet_name,
            pet_name_en=translation.translate(pet.pet_name),
            date_of_birth=pet.date_of_birth,
            breed=pet.breed,
            breed_en=translation.translate(pet.breed),
            gender=pet.gender,
            gender_en=translation.translate(check_gender(pet.gender)),
            color=pet.color,
            color_en=translation.translate(pet.color),
            species=pet.species,
            species_en=translation.translate(pet.species),
            organization_id=org_id,
            date=identifier.date if identifier else None,
            identifier_type=identifier.identifier_type if identifier else "—",
            identifier_type_en=translation.translate(identifier.identifier_type) if identifier else "—",
            identifier_number=identifier.identifier_number if identifier else "—",
            owner_passport_number=pet.owner.passport_number if pet.owner else "—",
            update_datetime=datetime.now().strftime('%d.%m.%Y %H:%M')
        )

    else:
        raise HTTPException(status_code=403, detail="Немає доступу")



@router.get("/{pet_id}/vaccinations", response_model=VaccinationsListResponse)
async def get_pet_vaccinations(pet_id: int, db: Session = Depends(get_db)):
    pet = db.query(Pets).options(joinedload(Pets.passport)).filter(Pets.pet_id == pet_id).first()
    if not pet:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pet with id {pet_id} not found"
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
    for vac in vaccinations_from_db:
        item = {
            "drug_name": format_value(vac.drug_name),
            "series_number": format_value(vac.series_number),
            "vaccination_date": format_value(vac.vaccination_date.strftime('%d.%m.%Y') if vac.vaccination_date else None),
            "valid_until": format_value(vac.valid_until.strftime('%d.%m.%Y') if vac.valid_until else None),
            "organization_name": format_value(vac.organization.organization_name if vac.organization else None)
        }
        vaccination_items.append(item)

    return {
        "passport_number": format_value(pet.passport.passport_number if pet.passport else None),
        "update_datetime": datetime.now().strftime('%d.%m.%Y %H:%M'),
        "vaccinations": vaccination_items
    }


def generate_passport_number(db) -> str:
    while True:
        number = randint(1000, 999999)
        passport_number = f"UA-AA-{number:06d}"
        exists = db.query(Passports).filter(Passports.passport_number == passport_number).first()
        if not exists:
            return passport_number

class GenderEnum(str, Enum):
    male = "Ч"
    female = "Ж"

@router.post("/pets", status_code=201)
async def add_pet(
    file: UploadFile,
    pet_name: str = Form(..., min_length=3, max_length=100),
    gender: GenderEnum = Form(...),
    breed: str = Form(..., min_length=3, max_length=50),
    species: str = Form(..., min_length=3, max_length=50),
    color: str = Form(..., min_length=3, max_length=30),
    date_of_birth:date = Form(...),
    identifier_type: str = Form(..., min_length=3, max_length=50),
    identifier_number: str = Form(..., min_length=3, max_length=50),
    chip_date: date = Form(...),
    owner_passport_number: str = Form(..., min_length=3, max_length=20),
    db: Session = Depends(get_db),
    cnap: Annotated[Union[Cnap, None], Depends(get_current_org_or_cnap)] = None,
):
    if cnap is None:
        raise HTTPException(status_code=403, detail="Додавати тварин можуть лише ЦНАП")

    user = db.query(Users).filter(Users.passport_number == owner_passport_number).first()
    if not user:
        raise HTTPException(status_code=404, detail="Користувача з таким паспортом не знайдено")

    passport_number = generate_passport_number(db)
    img_url: str = upload_image(file)  

    new_pet = Pets(
        img_url=img_url,
        pet_name=pet_name,
        species=species,
        breed=breed,
        gender=gender.value, 
        date_of_birth=date_of_birth,
        color=color,
        organization_id=cnap.cnap_id,
        user_id=user.user_id,
        sterilization=False
    )
    db.add(new_pet)
    db.commit()
    db.refresh(new_pet)

    existing_identifier = db.query(Identifiers).filter(
        Identifiers.identifier_number == identifier_number
    ).first()
    if existing_identifier:
        raise HTTPException(
            status_code=400,
            detail=f"Ідентифікатор з номером '{identifier_number}' вже існує"
        )

    identifier = Identifiers(
        identifier_number=identifier_number,
        identifier_type=identifier_type,
        date=chip_date,
        cnap_id=cnap.cnap_id,
        pet_id=new_pet.pet_id
    )
    db.add(identifier)
    db.commit()

    passport = Passports(
        passport_number=passport_number,
        pet_id=new_pet.pet_id,
        cnap_id=cnap.cnap_id
    )

    db.add(passport)
    db.commit()

    return {
        "message": "Тварину успішно додано",
        "pet_id": new_pet.pet_id,
        "img_url": img_url,
        "chip": {
            "identifier_number": identifier.identifier_number,
            "identifier_type": identifier.identifier_type,
            "chip_date": chip_date.isoformat()
        }
    }


@router.delete("/delete/{pet_id}")
async def delete_pet(
    pet_id: int,
    org_or_cnap: Annotated[Organizations | Cnap, Depends(get_current_org_or_cnap)],
    db: db_dependency
):

    # Определяем пользователя
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
        raise HTTPException(status_code=403, detail="Недостатньо прав для видалення")

    if org_type == "Притулок" and pet.organization_id != org_id:
        raise HTTPException(status_code=403, detail="Недостатньо прав для видалення")

    db.delete(pet)
    db.commit()

    return {"message": "Успішне видалення"}

@router.post("/generate-report")
async def generate_report(
    request: ReportRequest,
    user: Annotated[dict, Depends(get_current_user)],
    db: Session = Depends(get_db)
):
    pet = db.query(Pets).options(
        joinedload(Pets.owner),
        joinedload(Pets.identifiers),
        joinedload(Pets.passport)
    ).filter(Pets.pet_id == request.pet_id).first()
    
    if not pet:
        raise HTTPException(status_code=404, detail="Тваринку не знайдено")
    if pet.user_id != user.get('user_id'):
        raise HTTPException(status_code=403, detail="Ви не є власником")

    if request.name_document == "Офіційний витяг про ідентифікаційні дані тварини":
        if not pet.identifiers:
             raise HTTPException(status_code=400, detail="У тварини відсутній ідентифікатор (чип/клеймо)")
        
        identifier = pet.identifiers[-1]
        cnap_org = identifier.cnap
        
        pdf_context = {
            "creation_date": datetime.now().strftime("%d.%m.%Y"),
            "passport_number": pet.passport.passport_number if pet.passport else "Паспорт не оформлено",
            
            "pet_name": pet.pet_name,
            "species": pet.species,
            "breed": pet.breed,
            
            "identifier_db_id": f"ID запису: {identifier.identifier_id}",
            "identifier_number": identifier.identifier_number,
            "identifier_type": identifier.identifier_type,
            "identifier_date": identifier.date.strftime("%d.%m.%Y") if identifier.date else "—",
            
            # Передаємо словник "cnap", щоб працювало {{ cnap.name }}
            "cnap": {
                "name": cnap_org.name if cnap_org else "Невідомо",
                "city": cnap_org.city if cnap_org else "",
                "street": cnap_org.street if cnap_org else "",
                "phone_number": cnap_org.phone_number if cnap_org else "—"
            }
        }

        try:
            pdf_bytes = create_identification_pdf(pdf_context)
            
            filename = f"Extract_{pet.pet_id}.pdf"
            await send_report_email(
                to_email=pet.owner.email,
                pdf_bytes=pdf_bytes,
                filename=filename
            )

        except Exception as e:
            print(f"Server Error: {e}")
            raise HTTPException(status_code=500, detail="Помилка при генерації або відправці звіту.")

        return {"detail": "Витяг створено успішно та надіслано на вашу пошту"}

    else:
        raise HTTPException(status_code=400, detail="Тип документа не підтримується")