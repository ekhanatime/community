import subprocess
import webbrowser
import time
import os
import sys
import logging
from db.init_db import init_db
from db.check_db import check_db

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler('game_startup.log')
    ]
)

logger = logging.getLogger(__name__)

def get_project_root():
    """Get the absolute path to the project root directory"""
    return os.path.dirname(os.path.abspath(__file__))

def start_server():
    """Start the Flask server with the correct paths"""
    try:
        project_root = get_project_root()
        server_path = os.path.join(project_root, 'server.py')
        
        logger.info(f"Starting Flask server with server at {server_path}")
        server_process = subprocess.Popen(
            ["py", "-m", "flask", "--app", server_path, "run", "--debug"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            cwd=project_root
        )
        
        # Wait a moment and check if the server started successfully
        time.sleep(2)
        if server_process.poll() is not None:
            # Server failed to start
            stdout, stderr = server_process.communicate()
            logger.error(f"Server failed to start. Exit code: {server_process.returncode}")
            logger.error(f"stdout: {stdout.decode()}")
            logger.error(f"stderr: {stderr.decode()}")
            return None
            
        return server_process
        
    except Exception as e:
        logger.error(f"Error starting server: {str(e)}")
        return None

def main():
    try:
        # Initialize the database
        logger.info("Initializing database...")
        if not init_db():
            logger.error("Failed to initialize database")
            return 1
            
        # Verify database contents
        logger.info("Verifying database...")
        if not check_db():
            logger.error("Database verification failed")
            return 1
            
        # Start the Flask server
        logger.info("Starting server...")
        server_process = start_server()
        if server_process is None:
            logger.error("Failed to start server")
            return 1
            
        # Open the game in the default browser
        logger.info("Opening game in browser...")
        webbrowser.open('http://localhost:5000')
        
        logger.info("Game is running! Press Ctrl+C to stop the server.")
        
        try:
            # Keep the script running and monitor server process
            while True:
                if server_process.poll() is not None:
                    stdout, stderr = server_process.communicate()
                    logger.error("Server stopped unexpectedly")
                    logger.error(f"stdout: {stdout.decode()}")
                    logger.error(f"stderr: {stderr.decode()}")
                    break
                time.sleep(1)
                
        except KeyboardInterrupt:
            logger.info("Stopping server...")
            server_process.terminate()
            try:
                server_process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                server_process.kill()
            logger.info("Server stopped.")
            
        return 0
            
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return 1

if __name__ == "__main__":
    sys.exit(main())
