import sqlite3
import os

db_path = 'game.db'
if not os.path.exists(db_path):
    print(f"Database file not found at {db_path}")
    exit(1)

with sqlite3.connect(db_path) as conn:
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()
    print("Tables in database:")
    for table in tables:
        print(f"- {table[0]}")
