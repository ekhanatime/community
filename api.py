from flask import Flask, jsonify, send_from_directory, request
import sqlite3
import os
import traceback
import logging
import sys

app = Flask(__name__)

# Configure logging to output to both file and console
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler('game_server.log')
    ]
)

# Enable basic CORS
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization,Accept')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    response.headers.add('Access-Control-Expose-Headers', 'Content-Type,Authorization,Accept')
    app.logger.debug(f"Response headers: {dict(response.headers)}")
    return response

def get_db():
    try:
        db_path = os.path.join(os.path.dirname(__file__), 'game.db')
        app.logger.info(f"Attempting to connect to database at: {db_path}")
        
        if not os.path.exists(db_path):
            app.logger.error(f"Database file not found at {db_path}")
            raise Exception("Database file not found")
        
        db = sqlite3.connect(db_path)
        db.row_factory = sqlite3.Row
        app.logger.info("Successfully connected to database")
        return db
    except Exception as e:
        app.logger.error(f"Error connecting to database: {str(e)}\n{traceback.format_exc()}")
        raise

@app.route('/')
def root():
    try:
        if os.path.exists('area_planner/dist/index.html'):
            return send_from_directory('area_planner/dist', 'index.html')
        elif os.path.exists('area_planner/index.html'):
            return send_from_directory('area_planner', 'index.html')
        else:
            return 'Welcome to the Sustainable Village Planner API', 200
    except Exception as e:
        app.logger.error(f"Error serving index.html: {str(e)}\n{traceback.format_exc()}")
        return jsonify({"error": str(e)}), 500

@app.route('/<path:path>')
def serve_static(path):
    try:
        app.logger.info(f"Serving static file: {path}")
        return send_from_directory('.', path)
    except Exception as e:
        app.logger.error(f"Error serving static file {path}: {str(e)}\n{traceback.format_exc()}")
        return jsonify({"error": str(e)}), 404

@app.route('/api/buildings', methods=['GET'])
def get_buildings():
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute('SELECT * FROM buildings')
        buildings = cursor.fetchall()
        return jsonify([dict(b) for b in buildings])
    except Exception as e:
        app.logger.error(f"Error in get_buildings: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/building-types', methods=['GET'])
def get_building_types():
    try:
        return jsonify([
            'residential',
            'agriculture',
            'commercial'
        ])
    except Exception as e:
        app.logger.error(f"Error in get_building_types: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/terrain_types')
def get_terrain_types():
    try:
        app.logger.info("Fetching terrain types...")
        app.logger.debug(f"Request headers: {dict(request.headers)}")
        
        db = get_db()
        cursor = db.cursor()
        cursor.execute('SELECT * FROM terrain_types')
        terrain_types = [dict(row) for row in cursor.fetchall()]
        db.close()
        
        app.logger.info(f"Found {len(terrain_types)} terrain types")
        app.logger.debug(f"Terrain types: {terrain_types}")
        return jsonify(terrain_types)
    except Exception as e:
        app.logger.error(f"Error in get_terrain_types: {str(e)}\n{traceback.format_exc()}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.logger.info("Starting Flask server...")
    app.run(debug=True)
