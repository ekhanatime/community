import sqlite3
import os
import sys

def check_db():
    try:
        # Get the directory containing this script
        current_dir = os.path.dirname(os.path.abspath(__file__))
        db_path = os.path.join(os.path.dirname(current_dir), 'game.db')
        
        if not os.path.exists(db_path):
            print(f"Error: Database not found at {db_path}")
            print("Please run init_db.py first")
            sys.exit(1)
            
        conn = sqlite3.connect(db_path)
        conn.row_factory = sqlite3.Row
        c = conn.cursor()
        
        print("=== Terrain Types ===")
        c.execute('SELECT * FROM terrain_types')
        terrain_types = c.fetchall()
        if not terrain_types:
            print("Warning: No terrain types found!")
        for row in terrain_types:
            print(dict(row))
            
        print("\n=== Buildings ===")
        c.execute('SELECT * FROM buildings')
        buildings = c.fetchall()
        if not buildings:
            print("Warning: No buildings found!")
        for row in buildings:
            print(dict(row))
            
        print("\n=== Building Costs ===")
        c.execute('SELECT * FROM building_costs')
        costs = c.fetchall()
        if not costs:
            print("Warning: No building costs found!")
        for row in costs:
            print(dict(row))
            
        conn.close()
        print("\nDatabase check completed successfully!")
        return True
        
    except Exception as e:
        print(f"Error checking database: {str(e)}")
        return False

if __name__ == '__main__':
    check_db()
