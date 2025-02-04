-- Reset database
DROP TABLE IF EXISTS buildings;
DROP TABLE IF EXISTS terrain_types;
DROP TABLE IF EXISTS building_costs;

-- Create buildings table
CREATE TABLE buildings (
    code TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    icon TEXT NOT NULL,
    color TEXT NOT NULL,
    description TEXT
);

-- Create terrain_types table
CREATE TABLE terrain_types (
    code TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    color TEXT NOT NULL
);

-- Create building_costs table
CREATE TABLE building_costs (
    building_code TEXT PRIMARY KEY,
    gold INTEGER NOT NULL DEFAULT 0,
    wood INTEGER NOT NULL DEFAULT 0,
    stone INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (building_code) REFERENCES buildings(code)
);

-- Insert buildings
INSERT INTO buildings (code, name, category, icon, color, description) VALUES
    -- Residential
    ('house', 'House', 'residential', 'fa-home', '#e67e22', 'Basic residential building'),
    ('apartment', 'Apartment', 'residential', 'fa-building', '#d35400', 'Multi-family residential building'),
    ('mansion', 'Mansion', 'residential', 'fa-hotel', '#c0392b', 'Luxury residential building'),
    
    -- Commercial
    ('shop', 'Shop', 'commercial', 'fa-store', '#3498db', 'Small retail store'),
    ('mall', 'Shopping Mall', 'commercial', 'fa-shopping-cart', '#2980b9', 'Large retail complex'),
    ('office', 'Office', 'commercial', 'fa-briefcase', '#2c3e50', 'Office building'),
    
    -- Industrial
    ('factory', 'Factory', 'industrial', 'fa-industry', '#7f8c8d', 'Manufacturing facility'),
    ('warehouse', 'Warehouse', 'industrial', 'fa-warehouse', '#95a5a6', 'Storage facility'),
    ('powerplant', 'Power Plant', 'industrial', 'fa-bolt', '#e74c3c', 'Electricity generation'),
    
    -- Infrastructure
    ('road', 'Road', 'infrastructure', 'fa-road', '#34495e', 'Transportation network'),
    ('powerline', 'Power Line', 'infrastructure', 'fa-bolt', '#f1c40f', 'Electricity distribution'),
    ('pipeline', 'Water Pipeline', 'infrastructure', 'fa-tint', '#3498db', 'Water distribution'),
    
    -- Public Services
    ('hospital', 'Hospital', 'public', 'fa-hospital', '#e74c3c', 'Healthcare facility'),
    ('school', 'School', 'public', 'fa-school', '#f39c12', 'Education facility'),
    ('park', 'Park', 'public', 'fa-tree', '#27ae60', 'Recreation area');

-- Insert building costs
INSERT INTO building_costs (building_code, gold, wood, stone) VALUES
    ('house', 100, 50, 25),
    ('apartment', 200, 100, 50),
    ('mansion', 500, 200, 100),
    ('shop', 150, 75, 25),
    ('mall', 400, 150, 100),
    ('office', 300, 100, 75),
    ('factory', 400, 150, 100),
    ('warehouse', 200, 100, 50),
    ('powerplant', 500, 100, 200),
    ('hospital', 400, 150, 100),
    ('school', 300, 100, 75),
    ('park', 100, 50, 25);

-- Insert terrain types
INSERT INTO terrain_types (code, name, color) VALUES
    ('mountain', 'Mountain', '#9ca3af'),
    ('fields', 'Fields', '#fbbf24'),
    ('pasture', 'Pasture', '#34d399'),
    ('desert', 'Desert', '#fcd34d'),
    ('water', 'Water', '#60a5fa');
