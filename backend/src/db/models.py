from sqlalchemy import (
 String, ForeignKey, DateTime, Text, VARCHAR, func
)
from sqlalchemy.orm import (
    relationship, declared_attr, mapped_column, Mapped, DeclarativeBase
)
from typing_extensions import Annotated
from typing import List, Optional
from datetime import datetime


class Base(DeclarativeBase):
    pass

class TableNameMixin:
    @declared_attr.directive
    def __tablename__(cls) -> str:
        return cls.__name__.lower()

int_pk = Annotated[int, mapped_column(primary_key=True, index=True)]
str_20_pk = Annotated[str, mapped_column(String(20), primary_key=True, index=True)]

str_10 = Annotated[str, mapped_column(String(10))]
str_20 = Annotated[str, mapped_column(String(20))]
str_30 = Annotated[str, mapped_column(String(30))]
str_50 = Annotated[str, mapped_column(VARCHAR(50))]
str_100 = Annotated[str, mapped_column(VARCHAR(100))]
text_req = Annotated[str, mapped_column(Text)]
str_100_uniq = Annotated[str, mapped_column(String(100), unique=True)]

str_10_opt = Annotated[Optional[str], mapped_column(String(10))]
str_20_opt = Annotated[Optional[str], mapped_column(String(20))]
str_255_opt = Annotated[Optional[str], mapped_column(String(255))]
text_opt = Annotated[Optional[str], mapped_column(Text)]

datetime_req = Annotated[datetime, mapped_column(DateTime)]
datetime_opt = Annotated[Optional[datetime], mapped_column(DateTime)]
datetime_created = Annotated[datetime, mapped_column(DateTime, default=func.now())]
datetime_updated = Annotated[Optional[datetime], mapped_column(DateTime, onupdate=func.now())]

bool_req = Annotated[bool, mapped_column(default=False)]


class Extracts(Base, TableNameMixin):
    extract_id: Mapped[int_pk]
    extract_date: Mapped[datetime_req]
    extract_name: Mapped[str_100]
    pet_id: Mapped[int] = mapped_column(ForeignKey('pets.pet_id'))

    pet: Mapped["Pets"] = relationship(back_populates="extracts")


class Identifiers(Base, TableNameMixin):
    identifier_id: Mapped[int_pk]
    identifier_number: Mapped[str_50] = mapped_column(String(50), unique=True, nullable=False)
    identifier_type: Mapped[str_50]
    date: Mapped[datetime_req]
    cnap_id: Mapped[int] = mapped_column(ForeignKey('cnap.cnap_id'))
    pet_id: Mapped[int] = mapped_column(ForeignKey('pets.pet_id'))

    cnap: Mapped["Cnap"] = relationship(back_populates="identifiers")
    pet: Mapped["Pets"] = relationship(back_populates="identifiers")

class Organizations(Base, TableNameMixin):
    organization_id: Mapped[int_pk]
    organization_name: Mapped[str_100]
    organization_type: Mapped[str_50]
    city: Mapped[str_50]
    street: Mapped[str_50]
    building: Mapped[str_10_opt]
    phone_number: Mapped[str_20]
    email: Mapped[str_100_uniq]
    password: Mapped[text_req]
    cnap_id:  Mapped[int] = mapped_column(ForeignKey('cnap.cnap_id'))
    reset_token: Mapped[str_255_opt]
    reset_token_created_at: Mapped[datetime_opt]

    pets: Mapped[List["Pets"]] = relationship(back_populates="organization")
    requests: Mapped[List["Requests"]] = relationship(back_populates="organization")
    vaccinations: Mapped[List["Vaccinations"]] = relationship(back_populates="organization")


class Passports(Base, TableNameMixin):
    passport_number: Mapped[str_20_pk]
    pet_id: Mapped[int] = mapped_column(ForeignKey('pets.pet_id'), unique=True)
    cnap_id: Mapped[int] = mapped_column(ForeignKey('cnap.cnap_id'))

    pet: Mapped["Pets"] = relationship(back_populates="passport")
    organization: Mapped["Cnap"] = relationship(back_populates="passports")


class Cnap(Base):
    __tablename__ = "cnap"

    cnap_id: Mapped[int_pk]
    name: Mapped[Annotated[str, mapped_column(VARCHAR(150))]]
    region: Mapped[str_100]
    city: Mapped[str_100]
    street: Mapped[str_100]
    building: Mapped[Annotated[str, mapped_column(VARCHAR(20))]]
    phone_number: Mapped[Annotated[str, mapped_column(VARCHAR(20))]]
    email: Mapped[str_100]
    password: Mapped[str_100]
    coordinator_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("coordinator.coordinator_id", ondelete="SET NULL"),
        nullable=True
    )

    coordinator: Mapped[Optional["Coordinator"]] = relationship(
        "Coordinator",
        back_populates="cnaps"
    )
    passports: Mapped[List["Passports"]] = relationship(back_populates="organization")
    identifiers: Mapped[List["Identifiers"]] = relationship(back_populates="cnap")



class Pets(Base, TableNameMixin):
    pet_id: Mapped[int_pk]
    img_url: Mapped[text_opt]
    pet_name: Mapped[str_50]
    species: Mapped[str_50]
    breed: Mapped[str_50]
    gender: Mapped[str_10]
    date_of_birth: Mapped[datetime_req]
    color: Mapped[str_30]
    organization_id: Mapped[int] = mapped_column(ForeignKey('organizations.organization_id'))
    user_id: Mapped[int] = mapped_column(ForeignKey('users.user_id'))
    sterilization: Mapped[bool_req]

    owner: Mapped["Users"] = relationship(back_populates="pets")
    organization: Mapped["Organizations"] = relationship(back_populates="pets")
    passport: Mapped[Optional["Passports"]] = relationship(back_populates="pet", uselist=False)
    vaccinations: Mapped[List["Vaccinations"]] = relationship(back_populates="pet")
    extracts: Mapped[List["Extracts"]] = relationship(back_populates="pet")
    identifiers: Mapped[List["Identifiers"]] = relationship(back_populates="pet")
    requests: Mapped[List["Requests"]] = relationship(back_populates="pet")


class Requests(Base, TableNameMixin):
    request_id: Mapped[int_pk]
    creation_date: Mapped[datetime_created]
    organization_id: Mapped[int] = mapped_column(ForeignKey('organizations.organization_id'))
    user_id: Mapped[int] = mapped_column(ForeignKey('users.user_id'))
    pet_id: Mapped[int] = mapped_column(ForeignKey('pets.pet_id'))

    organization: Mapped["Organizations"] = relationship(back_populates="requests")
    user: Mapped["Users"] = relationship(back_populates="requests")
    pet: Mapped["Pets"] = relationship(back_populates="requests")


class Users(Base, TableNameMixin):
    user_id: Mapped[int_pk]
    last_name: Mapped[str_100]
    first_name: Mapped[str_100]
    patronymic: Mapped[str_100]
    passport_number: Mapped[str_20_opt]
    password: Mapped[text_req]
    postal_index: Mapped[str_10_opt]
    city: Mapped[str_50]
    street: Mapped[str_50]
    house_number: Mapped[str_10_opt]
    email: Mapped[str_100_uniq]
    reset_token: Mapped[str_255_opt]
    reset_token_created_at: Mapped[datetime_opt]

    pets: Mapped[List["Pets"]] = relationship(back_populates="owner")
    requests: Mapped[List["Requests"]] = relationship(back_populates="user")


class Vaccinations(Base, TableNameMixin):
    vaccination_id: Mapped[int_pk]
    manufacturer: Mapped[str_100]
    drug_name: Mapped[str_100]
    series_number: Mapped[str_50]
    vaccination_date: Mapped[datetime_req]
    valid_until: Mapped[datetime_req]
    organization_id: Mapped[int] = mapped_column(ForeignKey('organizations.organization_id'))
    pet_id: Mapped[int] = mapped_column(ForeignKey('pets.pet_id'))

    organization: Mapped["Organizations"] = relationship(back_populates="vaccinations")
    pet: Mapped["Pets"] = relationship(back_populates="vaccinations")

class Coordinator(Base):
    __tablename__ = "coordinator"

    coordinator_id: Mapped[int_pk]
    name: Mapped[str_100]
    type: Mapped[str_100]
    region: Mapped[str_100]
    email: Mapped[str_100]
    password: Mapped[str_100]

    cnaps: Mapped[list["Cnap"]] = relationship(
        "Cnap",
        back_populates="coordinator",
        cascade="all, delete-orphan"
    )
