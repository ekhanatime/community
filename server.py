from flask import Flask, jsonify, send_from_directory, request
import sqlite3
import os
import traceback
import logging
import sys

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,  # Set to DEBUG for more detailed logs
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler('game_server.log')
    ]
)

logger = logging.getLogger(__name__)

app = Flask(__name__)
logger.info("Flask app created")

# Enable basic CORS
@app.after_request
def after_request(response):
    logger.debug("Processing after_request")
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization,Accept')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    response.headers.add('Access-Control-Expose-Headers', 'Content-Type,Authorization,Accept')
    logger.debug(f"Response headers: {dict(response.headers)}")
    return response

def get_db():
    try:
        db_path = os.path.join(os.path.dirname(__file__), 'game.db')
        logger.debug(f"Attempting to connect to database at: {db_path}")
        
        if not os.path.exists(db_path):
            logger.error(f"Database file not found at {db_path}")
            raise Exception("Database file not found")
        
        db = sqlite3.connect(db_path)
        db.row_factory = sqlite3.Row
        logger.debug("Successfully connected to database")
        return db
    except Exception as e:
        logger.error(f"Error connecting to database: {str(e)}\n{traceback.format_exc()}")
        raise

@app.route('/')
def root():
    try:
        logger.debug("Serving index.html")
        return send_from_directory('.', 'index.html')
    except Exception as e:
        logger.error(f"Error serving index.html: {str(e)}\n{traceback.format_exc()}")
        return jsonify({"error": str(e)}), 500

@app.route('/<path:path>')
def serve_static(path):
    try:
        logger.debug(f"Serving static file: {path}")
        return send_from_directory('.', path)
    except Exception as e:
        logger.error(f"Error serving static file {path}: {str(e)}\n{traceback.format_exc()}")
        return jsonify({"error": str(e)}), 404

@app.route('/api/buildings')
def get_buildings():
    try:
        logger.debug("Fetching buildings...")
        logger.debug(f"Request headers: {dict(request.headers)}")
        
        db = get_db()
        cursor = db.cursor()
        cursor.execute('SELECT * FROM buildings')
        buildings = [dict(row) for row in cursor.fetchall()]
        db.close()
        
        logger.debug(f"Found {len(buildings)} buildings")
        logger.debug(f"Building details: {buildings}")
        return jsonify(buildings)
    except Exception as e:
        logger.error(f"Error in get_buildings: {str(e)}\n{traceback.format_exc()}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    logger.info("Starting Flask server...")
    app.run(debug=True)
