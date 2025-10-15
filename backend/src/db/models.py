from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.sql import func
from database import Base

class Extracts(Base):
  __tablename__ = 'extracts'

  extract_id = Column(Integer, primary_key=True, index=True)
  extract_date = Column(DateTime, nullable=False)
  extract_name = Column(String(100), nullable=False)
  pet_id = Column(Integer, ForeignKey('pets.pet_id'), nullable=False)


class Identifiers(Base):
  __tablename__ = 'identifiers'

  identifiers_id = Column(Integer, primary_key=True, index=True)
  identifier_number = Column(String(50), nullable=False)
  identifier_type = Column(String(50), nullable=False)
  date = Column(DateTime, nullable=False)
  organization_id = Column(Integer, ForeignKey('organizations.organization_id'), nullable=False)
  pet_id = Column(Integer, ForeignKey('pets.pet_id'), nullable=False)


class Organizations(Base):
  __tablename__ = 'organizations'

  organization_id = Column(Integer, primary_key=True, index=True)
  organization_name = Column(String(100), nullable=False)
  organization_type = Column(String(50), nullable=False)
  city = Column(String(50), nullable=False)
  street = Column(String(50), nullable=False)
  building = Column(String(10))
  phone_number = Column(String(20), nullable=False)
  email = Column(String(100), nullable=False)
  password = Column(Text, nullable=False)


class Passports(Base):
  __tablename__ = 'passports'

  passport_number = Column(String(20), primary_key=True, index=True)
  pet_id = Column(Integer, ForeignKey('pets.pet_id'), unique=True, nullable=False)



class Pets(Base):
  __tablename__ = 'pets'

  pet_id = Column(Integer, primary_key=True, index=True)
  img_url = Column(Text)
  pet_name = Column(String(50), nullable=False)
  species = Column(String(50), nullable=False)
  breed = Column(String(50), nullable=False)
  gender = Column(String(10), nullable=False)
  date_of_birth = Column(DateTime, nullable=False)
  color = Column(String(30), nullable=False)
  organization_id = Column(Integer, ForeignKey('organizations.organization_id'), nullable=False)
  user_id = Column(Integer, ForeignKey('users.user_id'), nullable=False)
  sterilization = Column(bool, nullable=False, default=False)


class Requests(Base):
  __tablename__ = 'requests'

  request_id = Column(Integer, primary_key=True, index=True)
  status = Column(String(50), nullable=False)
  request_type = Column(String(50), nullable=False)
  creation_date = Column(DateTime, nullable=False, default=func.now())
  update_date = Column(DateTime, onupdate=func.now())
  organization_id = Column(Integer, ForeignKey('organizations.organization_id'), nullable=False)
  user_id = Column(Integer, ForeignKey('users.user_id'), nullable=False)
  pet_id = Column(Integer, ForeignKey('pets.pet_id'), nullable=False)


class Users(Base):
  __tablename__ = 'users'

  user_id = Column(Integer, primary_key=True, index=True)
  last_name = Column(String(100), nullable=False) # <--
  first_name = Column(String(100), nullable=False) # <--
  patronymic = Column(String(100)) 
  passport_number = Column(String(20)) 
  password = Column(Text, nullable=False) 
  postal_index = Column(String(10)) 
  city = Column(String(50)) 
  street = Column(String(50))
  house_number = Column(String(10)) 
  email = Column(String(100), unique=True, nullable=False) 

class Vaccinations(Base):
  __tablename__ = 'vaccinations'

  vaccination_id = Column(Integer, primary_key=True, index=True)
  manufacturer = Column(String(100), nullable=False) 
  drug_name = Column(String(100), nullable=False) 
  series_number = Column(String(50)) 
  vaccination_date = Column(DateTime, nullable=False) 
  valid_until = Column(DateTime, nullable=False) 
  organization_id = Column(Integer, ForeignKey('organizations.organization_id'), nullable=False) 
  pet_id = Column(Integer, ForeignKey('pets.pet_id'), nullable=False) 

