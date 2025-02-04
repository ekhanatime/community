import pytest
from flask import json
import sys
import os

# Add the parent directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from api import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_index_route(client):
    """Test the index route returns successfully"""
    rv = client.get('/')
    assert rv.status_code == 200

def test_buildings_route(client):
    """Test the buildings endpoint returns a list"""
    rv = client.get('/api/buildings')
    json_data = json.loads(rv.data)
    assert isinstance(json_data, list)
    assert rv.status_code == 200

def test_add_building(client):
    """Test adding a new building"""
    test_building = {
        'name': 'Test Building',
        'type': 'residential',
        'position': {'x': 0, 'y': 0}
    }
    rv = client.post('/api/buildings', 
                    data=json.dumps(test_building),
                    content_type='application/json')
    assert rv.status_code == 201
    json_data = json.loads(rv.data)
    assert json_data.get('name') == 'Test Building'
