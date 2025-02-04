from sqlalchemy import Column, Integer, Float, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class BuildingType(Base):
    __tablename__ = 'building_types'
    id = Column(Integer, primary_key=True)
    name = Column(String(50), unique=True)
    description = Column(String(200))
    footprint_x = Column(Float)  # Meters
    footprint_y = Column(Float)
    height = Column(Float)
    category = Column(String(20))  # energy, housing, water, etc.
    power_generation = Column(Float)  # kW
    power_consumption = Column(Float)
    max_occupancy = Column(Integer)
    area_sqm = Column(Float)
    power_efficiency = Column(String(5))

class BuildingInstance(Base):
    __tablename__ = 'building_instances'
    id = Column(Integer, primary_key=True)
    type_id = Column(Integer)
    pos_x = Column(Float)  # Meters from origin
    pos_y = Column(Float)
    rotation = Column(Float)  # Degrees
    placed_at = Column(DateTime, default=datetime.utcnow)
