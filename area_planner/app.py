from flask import Flask, render_template, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from models import Base, BuildingType, BuildingInstance
from datetime import datetime
import os
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Print current working directory and template folder
logger.info(f"Current Working Directory: {os.getcwd()}")
logger.info(f"Dist folder exists: {os.path.exists('dist')}")
if os.path.exists('dist'):
    logger.info(f"Files in dist: {os.listdir('dist')}")

app = Flask(__name__, 
            static_folder='dist',
            static_url_path='')

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///planner.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app, model_class=Base)

def init_default_buildings():
    logger.info("Initializing default buildings")
    try:
        default_types = [
            {
                'name': 'Solar Array',
                'description': '4.8kW photovoltaic system with battery storage',
                'footprint_x': 10.0,
                'footprint_y': 5.0,
                'height': 3.0,
                'category': 'energy',
                'power_generation': 4.8,
                'power_consumption': 0.2
            },
            {
                'name': 'Vertical Axis Wind Turbine',
                'description': 'Low-noise 5kW wind generator with 15m tower',
                'footprint_x': 5.0,
                'footprint_y': 5.0,
                'height': 15.0,
                'category': 'energy',
                'power_generation': 5.0,
                'power_consumption': 0.1
            },
            {
                'name': 'Geodesic Dome (25㎡)',
                'description': 'Compact eco-dome with rainwater collection',
                'footprint_x': 5.0,
                'footprint_y': 5.0,
                'height': 3.5,
                'category': 'housing',
                'power_consumption': 1.8,
                'max_occupancy': 2,
                'area_sqm': 25.0,
                'power_efficiency': 'A++'
            },
            {
                'name': 'Geodesic Dome (50㎡)',
                'description': 'Family-sized sustainable dwelling',
                'footprint_x': 7.1,
                'footprint_y': 7.1,
                'height': 4.2,
                'category': 'housing',
                'power_consumption': 3.0,
                'max_occupancy': 4,
                'area_sqm': 50.0,
                'power_efficiency': 'A+'
            },
            {
                'name': 'Micro House',
                'description': '45㎡ modular dwelling with green roof',
                'footprint_x': 7.0,
                'footprint_y': 7.0,
                'height': 4.5,
                'category': 'housing',
                'power_consumption': 3.2,
                'max_occupancy': 3,
                'area_sqm': 45.0,
                'power_efficiency': 'A+'
            },
            {
                'name': 'Water Treatment Hub',
                'description': 'Rainwater harvesting and purification system',
                'footprint_x': 8.0,
                'footprint_y': 6.0,
                'height': 5.0,
                'category': 'water',
                'power_generation': 0.0,
                'power_consumption': 2.1
            }
        ]

        for bt in default_types:
            if not BuildingType.query.filter_by(name=bt['name']).first():
                db.session.add(BuildingType(**bt))
        db.session.commit()
        logger.info("Default buildings initialized successfully")
    except Exception as e:
        logger.error(f"Error initializing default buildings: {str(e)}")

@app.route('/')
def index():
    logger.info("Index route called")
    try:
        logger.debug("Attempting to serve index.html from dist directory")
        return send_from_directory('dist', 'index.html')
    except Exception as e:
        logger.error(f"Error serving index.html: {str(e)}")
        return f"Error: {str(e)}", 500

@app.route('/api/buildings', methods=['GET'])
def get_buildings():
    logger.info("Buildings API route called")
    try:
        buildings = BuildingType.query.all()
        return jsonify([{
            'id': b.id,
            'name': b.name,
            'description': b.description,
            'footprint_x': b.footprint_x,
            'footprint_y': b.footprint_y,
            'height': b.height,
            'category': b.category
        } for b in buildings])
    except Exception as e:
        logger.error(f"Error in get_buildings: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        init_default_buildings()
    app.run(port=5000, debug=True)
