import os

def verify_schema():
    # Get the schema path
    current_dir = os.path.dirname(os.path.abspath(__file__))
    schema_path = os.path.join(current_dir, 'db', 'schema.sql')
    
    print(f"Looking for schema at: {schema_path}")
    
    if not os.path.exists(schema_path):
        print("Error: Schema file not found!")
        return
        
    print("Schema file found! Contents:")
    print("-" * 50)
    with open(schema_path, 'r') as f:
        print(f.read())
    print("-" * 50)

if __name__ == "__main__":
    verify_schema()
