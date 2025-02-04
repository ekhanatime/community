-- Create buildings table
CREATE TABLE IF NOT EXISTS buildings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    x INTEGER,
    y INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create initial building types
INSERT OR IGNORE INTO buildings (code, name, type, x, y) VALUES
    ('house_1', 'Small House', 'residential', NULL, NULL),
    ('farm_1', 'Small Farm', 'agriculture', NULL, NULL),
    ('market_1', 'Market', 'commercial', NULL, NULL);
