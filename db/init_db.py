import sqlite3
import os
import sys
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)

logger = logging.getLogger(__name__)                                                                                                                                                                                                    

def get_project_root():
    """Get the absolute path to the project root directory"""
    return os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def init_db():
    """Initialize the database with schema and initial data"""
    try:
        # Get absolute paths
        project_root = os.path.abspath(get_project_root())  # Make sure it's absolute
        schema_path = os.path.abspath(os.path.join(os.path.dirname(__file__), 'schema.sql'))
        db_path = os.path.abspath(os.path.join(project_root, 'game.db'))
        
        logger.info(f"Project root: {project_root}")
        logger.info(f"Schema path: {schema_path}")
        logger.info(f"Database path: {db_path}")
        
        # Read schema file
        if not os.path.exists(schema_path):
            logger.error(f"Schema file not found at {schema_path}")
            return False
            
        with open(schema_path, 'r') as f:
            schema = f.read()
        
        # Remove existing database if it exists
        if os.path.exists(db_path):
            logger.info(f"Removing existing database at {db_path}")
            try:
                os.remove(db_path)
            except PermissionError:
                logger.error(f"Permission denied when trying to remove {db_path}")
                return False
            except Exception as e:
                logger.error(f"Error removing database: {str(e)}")
                return False
        
        # Connect to database and execute schema
        logger.info("Creating new database...")
        try:
            with sqlite3.connect(db_path) as conn:
                conn.executescript(schema)
                logger.info(f"Database initialized successfully at {db_path}")
                return True
        except sqlite3.Error as e:
            logger.error(f"SQLite error: {str(e)}")
            return False
        except Exception as e:
            logger.error(f"Error creating database: {str(e)}")
            return False
            
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return False

if __name__ == "__main__":
    success = init_db()
    sys.exit(0 if success else 1)
