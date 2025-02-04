import sqlite3
import os

def init_db():
    """Initialize the database with schema"""
    if os.path.exists('game.db'):
        os.remove('game.db')
    
    conn = sqlite3.connect('game.db')
    
    with open('schema.sql', 'r') as f:
        conn.executescript(f.read())
    
    conn.commit()
    conn.close()

if __name__ == '__main__':
    init_db()
    print("Database initialized successfully!")
