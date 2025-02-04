# This file makes Python treat the directory as a package
from .app import app, db
from .models import Base, BuildingType, BuildingInstance
