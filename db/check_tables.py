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

def check_tables():
    try:
        # Get database path
        project_root = get_project_root()
        db_path = os.path.join(project_root, 'game.db')
        
        if not os.path.exists(db_path):
            logger.error(f"Database file not found at {db_path}")
            return False
            
        # Connect to database
        with sqlite3.connect(db_path) as conn:
            cursor = conn.cursor()
            
            # Get list of tables
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
            tables = cursor.fetchall()
            logger.info("Tables in database:")
            for table in tables:
                logger.info(f"- {table[0]}")
                
                # Get table schema
                cursor.execute(f"PRAGMA table_info({table[0]})")
                columns = cursor.fetchall()
                logger.info("  Columns:")
                for col in columns:
                    logger.info(f"    - {col[1]} ({col[2]})")
                    
                # Get row count
                cursor.execute(f"SELECT COUNT(*) FROM {table[0]}")
                count = cursor.fetchone()[0]
                logger.info(f"  Row count: {count}")
                
                # Show sample data
                cursor.execute(f"SELECT * FROM {table[0]} LIMIT 3")
                rows = cursor.fetchall()
                logger.info("  Sample data:")
                for row in rows:
                    logger.info(f"    {row}")
                logger.info("")
                
        return True
        
    except Exception as e:
        logger.error(f"Error checking database: {str(e)}")
        return False

if __name__ == "__main__":
    success = check_tables()
    sys.exit(0 if success else 1)
